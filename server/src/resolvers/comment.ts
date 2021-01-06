import { Comment } from '../entities/Comment';
import { Arg, Ctx, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware  } from 'type-graphql';
import {  FieldError } from './response';
import { isAuth } from '../middlewares/isAuthMiddleware';
import {isCan} from '../middlewares/isCanMiddleware';
import { CommentInput, CommentSearchInput } from './Input';
import { checkSmsToken, commentValidator } from '../validators/commentValidator';
import { getConnection } from 'typeorm';
import { MyContext } from '../types';
import { Question } from '../entities/Question';
import { Sms } from '../entities/Sms';
import { Answer } from '../entities/Answer';
import { createLog } from '../constants/functions';


@ObjectType()
export class PaginatedComments {
    @Field()
    total!: number;
    @Field()
    page!: number;
    @Field()
    pages!: number;
    @Field(() => [Comment],{ nullable : true })
    comments?: Comment[];
}

@ObjectType()
export class CommentResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => Comment , { nullable : true })
    comment?: Comment;
    @Field(() => [Comment] , { nullable : true })
    comments?: Comment[];
}
@ObjectType()
export class GetQuestionsAndCommentsResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => Int , {nullable : true})
    smsId?: number;
    @Field(() => [Question] , { nullable : true })
    questions?: Question[];
    @Field(() => [Comment] , { nullable : true })
    comments?: Comment[];
    
}
@ObjectType()
export class CommentsResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => PaginatedComments , { nullable : true })
    docs?: PaginatedComments;
}

@Resolver(Comment)
export class CommentResolver {

    @FieldResolver(() => Question)
    async question( 
      @Root() comment : Comment,
    ){return await Question.findOne(comment.questionId)}

    @FieldResolver(() => Sms)
    async sms( 
      @Root() comment : Comment,
    ){return await Sms.findOne(comment.smsId)}
    
    @FieldResolver(() => Answer)
    async answer( 
      @Root() comment : Comment,
    ){return await Answer.findOne(comment.answerId)}


    @Query(() => GetQuestionsAndCommentsResponse)
    async getOptionsForCreateComment(
        @Arg('token') token : string
    ) : Promise<GetQuestionsAndCommentsResponse> {
        
        let errors = await checkSmsToken(token);
        if(errors?.length) return { status : false , errors};
        const sms = await Sms.findOne({where : {token}});
        const questions = await getConnection().query(`
            select q.* from question as q
            where q.surveyId = ${sms?.surveyId}
            order by q.turn
        `);
        const comments = await getConnection().query(`select s.* from comment as s where s.smsId = ${sms?.id}`);
        return {status : true , questions , comments , smsId : sms?.id}
    }
    
    @Mutation(() => CommentsResponse)
    @UseMiddleware(isAuth,isCan("show-comment" , "Comment"))
    async getComments(
        @Arg('limit', () => Int, {nullable : true}) limit: number,
        @Arg('page', () => Int,{nullable : true}) page: number,
        @Arg('input') input: CommentSearchInput,
    ) : Promise<CommentsResponse>{
        const { status , text , questionId , smsId , callId , customerId , answerId , typeId } = input;
        const currentPage = page || 1;
        const take = limit || 10;
        const skip = (currentPage - 1) * take;
        const tableName = "`call`";
        const query = `from comment as s 
        ${callId ? `left join sms as a on a.id = s.smsId ` : ""}
        ${customerId ? `left join sms as a on a.id = s.smsId left join ${tableName} as c on c.id = s.callId ` : ""}
        ${typeId ? `left join question as q on q.id = s.questionId ` : ""}
        where s.status = ${status ? status : "s.status"} 
        ${callId ? ` and a.callId = ${callId} ` : ""}
        ${customerId ? ` and c.customerId = ${customerId} ` : ""}
        ${questionId ? ` and s.questionId = ${questionId} ` : ""}
        ${smsId ? ` and s.smsId = ${smsId} ` : ""}
        ${typeId ? ` and q.typeId = ${typeId} ` : ""}
        ${answerId ? ` and s.answerId = ${answerId} ` : ""}
        ${text ? ` and s.text LIKE '%${text}%' `: ""}
        `;
        const t = await getConnection().query(`select count(*) as 'count' ${query}`);
        const comments = await getConnection().query(`select s.* ${query} order by id desc limit ${skip},${take}`);
        const total = t[0].count;
        let pages = Math.floor((total % take > 0) ? (total / take) + 1 : (total / take)) as number

        return {status : true , docs : {comments , total , page : currentPage , pages}}
    }
    @Query(() => CommentResponse)
    @UseMiddleware(isAuth,isCan("show-comment" , "Comment"))
    async getComment(
        @Arg('id' , () => Int) id : number
    ) : Promise<CommentResponse>{
        const errors = await commentValidator(null, id );
        if(errors?.length) return { status : false , errors};
        const comment = await Comment.findOne({id});
        return { status : true , comment }
    }

    @Mutation(() => CommentResponse)
    async createComment(
        @Arg('input') input: CommentInput
    ) : Promise<CommentResponse>{
        const errors = await commentValidator(input,null);
        if(errors?.length) return { status : false , errors};
        const {text , questionId , smsId , answerIds} = input;
        await Comment.delete({questionId , smsId});
        if(answerIds?.length){
            await answerIds?.forEach( async(answerId) => {
                 await Comment.create({questionId , smsId , answerId}).save();
            });
        }else{
            await Comment.create({text , questionId , smsId }).save();
        }
        const question = await Question.findOne({id : questionId});
        if(question && question.isUsedOk){
            await Sms.update({id :smsId} , {used : true})
        }
        return await { status: true};
    }
    @Mutation(() => Boolean)
    async checkSms(
        @Arg('smsId', () => Int) smsId : number
    ) : Promise<Boolean> {
        await Sms.update({id :smsId} , {checkSms : true})
        return true
    }

    @Mutation(() => CommentResponse)
    async updateComment(
        @Arg('id' , () => Int) id: number,
        @Arg('input') input: CommentInput
    ) : Promise<CommentResponse>{
        let errors = await commentValidator(input , id);
        if(errors?.length) return { status : false , errors};
        await Comment.update({id} , {...input});
 
        return { status: true };
    }

    @Mutation(() => CommentResponse)
    @UseMiddleware(isAuth,isCan("status-comment" , "Comment"))
    async activeOrDeactiveComment(
        @Arg('id' , () => Int) id: number,
        @Arg('status') status: boolean,
        @Ctx() {payload} : MyContext
    ) : Promise<CommentResponse>{
        const errors = await commentValidator(null, id);
        if(errors?.length) return { status : false , errors};
        await Comment.update({id},{ status });
        const comment = await Comment.findOne({id});
        await createLog(payload?.userId as number , 14 , "activeOrDeactive" , comment , id);
        return {status : true};
    }
}
