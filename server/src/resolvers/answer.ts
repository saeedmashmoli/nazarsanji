import { Answer } from '../entities/Answer';
import { Arg, Ctx, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root , UseMiddleware } from 'type-graphql';
import { isAuth } from '../middlewares/isAuthMiddleware';
import {isCan} from '../middlewares/isCanMiddleware';
import { AnswerInput , AnswerSearchInput } from './Input';
import { FieldError } from './response';
import { answerValidator } from '../validators/answerValidator';
import { Question } from '../entities/Question';
import { getConnection ,Not ,In } from 'typeorm';
import { MyContext } from '../types';
import { createLog } from '../constants/functions';

@ObjectType()
export class PaginatedAnswers {
    @Field()
    total!: number;
    @Field()
    page!: number;
    @Field()
    pages!: number;
    @Field(() => [Answer],{ nullable : true })
    answers?: Answer[];
}

@ObjectType()
export class AnswerResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => Answer , { nullable : true })
    answer?: Answer;
}
@ObjectType()
export class AnswersResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => PaginatedAnswers , { nullable : true })
    docs?: PaginatedAnswers;
}

@Resolver(Answer)
export class AnswerResolver {
    

    @FieldResolver(() => Answer)
    question( 
      @Root() answer : Answer,
    ){return Question.findOne(answer.questionId)}

    @Query(() => [Question])
    async getQuestionsForCreateAnswer() : Promise<Question[]> {
        return await Question.find({where : {status : true , typeId : Not(In([5,6,3]))}});
    }


    @Mutation(() => AnswersResponse)
    @UseMiddleware(isAuth,isCan("show-answer" , "Answer"))
    async getAnswers(
        @Arg('limit', () => Int, {nullable : true}) limit: number,
        @Arg('page', () => Int,{nullable : true}) page: number,
        @Arg('input') input: AnswerSearchInput,
    ) : Promise<AnswersResponse>{
        const { status , title, flag , questionId , link } = input;
        const currentPage = page || 1;
        const take = limit || 10;
        const skip = (currentPage - 1) * take;
        const tableName = "`answer`";
        const query = `from ${tableName} as s 
        where s.status = ${status ? status : "s.status"} 
        
        ${title ? ` and s.title LIKE '%${title}%' `: ""}
        ${questionId ? `and s.questionId = ${questionId} ` : ""}
        ${link ? `and s.link LIKE '%${link}%' ` : ""}
        ${flag ? `and s.flag = ${flag} ` : ""}
        `;
        const t = await getConnection().query(`select count(*) as 'count' ${query}`);
        const answers = await getConnection().query(`select s.* ${query} order by id desc limit ${skip},${take}`);
        const total = t[0].count;
        let pages = Math.floor((total % take > 0) ? (total / take) + 1 : (total / take)) as number

        return {status : true , docs : { answers , total , page : currentPage , pages }}
    }
    @Query(() => AnswerResponse)
    @UseMiddleware(isAuth,isCan("show-answer" , "Answer"))
    async getAnswer(
        @Arg('id' , () => Int) id : number
    ) : Promise<AnswerResponse>{
        const errors = await answerValidator(null , id);
        if(errors?.length) return { status : false , errors};
        const answer = await Answer.findOne({id});
        return { status : true , answer }
    }

    @Mutation(() => AnswerResponse)
    @UseMiddleware(isAuth,isCan("create-answer" , "Answer"))
    async createAnswer(
        @Arg('input') input: AnswerInput,
        @Ctx() {payload} : MyContext
    ) : Promise<AnswerResponse>{
        const errors = await answerValidator(input , null);
        if(errors?.length) return { status : false , errors};
        const answer = await Answer.create({...input}).save();
        await createLog(payload?.userId as number , 3 , "create" , answer , answer.id);
        return {status : true};
    }

    @Mutation(() => AnswerResponse)
    @UseMiddleware(isAuth,isCan("update-answer" , "Answer"))
    async updateAnswer(
        @Arg('id' , () => Int) id: number,
        @Arg('input') input: AnswerInput,
        @Ctx() {payload} : MyContext
    ) : Promise<AnswerResponse>{
        const errors = await answerValidator(input , id);
        if(errors?.length) return { status : false , errors};
        await Answer.update({id},{...input});
        const answer = await Answer.findOne({id});
        await createLog(payload?.userId as number , 3 , "edit" , answer , id);
        return {status : true };
    }

    @Mutation(() => AnswerResponse)
    @UseMiddleware(isAuth,isCan("status-answer" , "Answer"))
    async activeOrDeactiveAnswer(
        @Arg('id' , () => Int) id: number,
        @Arg('status') status: boolean,
        @Ctx() {payload} : MyContext
    ) : Promise<AnswerResponse>{
        const errors = await answerValidator(null , id);
        if(errors?.length) return { status : false , errors};
        await Answer.update({id},{ status });
        const answer = await Answer.findOne({id});
        await createLog(payload?.userId as number , 3 , "activeOrDeactive" , answer , id);
        return {status : true};
    }
}
