import { Question } from '../entities/Question';
import { Arg, Ctx, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root , UseMiddleware  } from 'type-graphql';
import { isAuth } from '../middlewares/isAuthMiddleware';
import {isCan} from '../middlewares/isCanMiddleware';
import { QuestionInput, QuestionSearchInput } from './Input';
import { FieldError } from './response';
import { questionValidator } from '../validators/questionValidator';
import { Survey } from '../entities/Survey';
import { Type } from '../entities/Type';
import { getConnection } from 'typeorm';
import { MyContext } from '../types';
import { Condition } from '../entities/Condition';
import { Answer } from '../entities/Answer';
import { createLog } from '../constants/functions';
import { Criteria } from '../entities/Criteria';

@ObjectType()
export class PaginatedQuestions {
    @Field()
    total!: number;
    @Field()
    page!: number;
    @Field()
    pages!: number;
    @Field(() => [Question],{ nullable : true })
    questions?: Question[];
}

@ObjectType()
export class QuestionResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => Question , { nullable : true })
    question?: Question;
}
@ObjectType()
export class QuestionsResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => PaginatedQuestions , { nullable : true })
    docs?: PaginatedQuestions;
}
@ObjectType()
export class TypesResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => [Type] , { nullable : true })
    types?: Type[];
}
@ObjectType()
export class SurveysAndTypesResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => [Type] , { nullable : true })
    types?: Type[];
    @Field(() => [Criteria] , { nullable : true })
    criterias?: Criteria[];
}

@Resolver(Question)
export class QuestionResolver {
    
    @FieldResolver(() => Question)
    survey( 
      @Root() question : Question,
    ){return Survey.findOne(question.surveyId)}

    @FieldResolver(() => [Question])
    type( 
      @Root() question : Question,
    ){return Type.findOne(question.typeId)}
    @FieldResolver(() => [Answer])
    async answers( 
      @Root() question : Question,
    ){return await Answer.find({where : {questionId : question.id , status : true}})}

    @FieldResolver(() => [Condition])
    async conditions( 
      @Root() question : Question,
    ){return await Condition.find({where : {consQuestionId : question.id , status : true}})}

    @Query(() => SurveysAndTypesResponse)
    async getTypesForCreateQuestion() : Promise<SurveysAndTypesResponse> {
        const types = await Type.find({where : {status : true}})
        const criterias = await Criteria.find({where : {status : true}})
        return { status : true , types , criterias};
    }

    @Query(() => QuestionResponse)
    @UseMiddleware(isAuth,isCan("show-survey" , "Survey"))
    async getQuestion(
        @Arg('id' , () => Int) id : number
    ) : Promise<QuestionResponse>{
        const errors = await questionValidator(null , id);
        if(errors?.length) return { status : false , errors};
        const question = await Question.findOne({id});
        return { status : true , question }
    }

    @Mutation(() => QuestionsResponse)
    @UseMiddleware(isAuth,isCan("show-survey" , "Survey"))
    async getQuestions(
        @Arg('limit', () => Int, {nullable : true}) limit: number,
        @Arg('page', () => Int,{nullable : true}) page: number,
        @Arg('input') input: QuestionSearchInput,
    ) : Promise<QuestionsResponse>{
        const { status , title, answerId , surveyId , shouldBe , typeId  } = input;
        const currentPage = page || 1;
        const take = limit || 10;
        const skip = (currentPage - 1) * take;
        const tableName = "`question`";
        const query = `from ${tableName} as s 
        ${answerId ? `left join answer as a on a.questionId = s.id` : ""}
        where s.status = ${status ? status : "s.status"} 
        ${answerId ? `and a.id = ${answerId}` : ""}
        ${title ? ` and s.title LIKE '%${title}%' `: ""}
        ${surveyId ? `and s.surveyId = ${surveyId} ` : ""}
        ${shouldBe ? `and s.shouldBe = ${shouldBe} ` : ""}
        ${typeId ? `and s.typeId = ${typeId} ` : ""}
        `;
        const t = await getConnection().query(`select count(*) as 'count' ${query}`);
        const questions = await getConnection().query(`select s.* ${query} order by id desc limit ${skip},${take}`);
        const total = t[0].count;
        let pages = Math.floor((total % take > 0) ? (total / take) + 1 : (total / take)) as number

        return {status : true , docs : { questions , total , page : currentPage , pages }}
    }

    @Mutation(() => QuestionResponse)
    @UseMiddleware(isAuth,isCan("show-survey" , "Survey"))
    async createQuestion(
        @Arg('input') input: QuestionInput,
        @Ctx() {payload} : MyContext
    ) : Promise<QuestionResponse>{
        const errors = await questionValidator(input);
        if(errors?.length) return { status : false , errors};
        const question = await Question.create({...input}).save();
        await createLog(payload?.userId as number , 2 , "create" , question , question.id);
        return {status : true , question};
    }

    @Mutation(() => QuestionResponse)
    @UseMiddleware(isAuth,isCan("show-survey" , "Survey"))
    async updateQuestion(
        @Arg('id' ,() => Int) id: number,
        @Arg('input') input: QuestionInput,
        @Ctx() {payload} : MyContext
    ) : Promise<QuestionResponse>{
        let errors = await questionValidator(input , id);
        if(errors?.length) return { status : false , errors};
        await Question.update({id},{...input});
        const question = await Question.findOne({id});
        await createLog(payload?.userId as number , 2 , "edit" , question , id);
        return {status : true , question};
    }

    @Mutation(() => QuestionResponse)
    @UseMiddleware(isAuth,isCan("show-survey" , "Survey"))
    async activeOrDeactiveQuestion(
        @Arg('id' , () => Int) id: number,
        @Arg('status') status: boolean,
        @Ctx() {payload } : MyContext
    ) : Promise<QuestionResponse>{
        const errors = await questionValidator(null, id);
        if(errors?.length) return { status : false , errors};
        await Question.update({id},{ status });
        const question = await Question.findOne({id});
        await createLog(payload?.userId as number , 2 , "activeOrDeactive" , question , id);
        return {status : true};
    }
}
