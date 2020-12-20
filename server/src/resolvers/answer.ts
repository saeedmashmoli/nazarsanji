import { Answer } from '../entities/Answer';
import { Arg, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root  } from 'type-graphql';
// import { isAuth } from '../middlewares/isAuthMiddleware';
// import {isCan} from '../middlewares/isCanMiddleware';
import { AnswerInput } from './Input';
import { FieldError } from './response';
import { answerValidator , updateOrDeleteAnswerValidator } from '../validators/answerValidator';
import { Question } from '../entities/Question';
import { getConnection } from 'typeorm';

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
    @Field(() => [Answer] , { nullable : true })
    answers?: Answer[];
}

@Resolver(Answer)
export class AnswerResolver {
    

    @FieldResolver(() => Answer)
    question( 
      @Root() answer : Answer,
    ){return Question.findOne(answer.questionId)}


    @Mutation(() => AnswersResponse)
    // @UseMiddleware(isAuth,isCan("question-show" , "Question"))
    async getAnswers(
        @Arg('status') status: Boolean
    ) : Promise<AnswersResponse>{
        const answers = await getConnection().query(` 
            select a.* from answer as a 
            where ${status ? "status = true" : "status = status"}
            order by a.id desc
        `);
        return {answers , status : true}
    }
    @Query(() => AnswerResponse)
    // @UseMiddleware(isAuth,isCan("survey-show" , "Survey"))
    async getAnswer(
        @Arg('id' , () => Int) id : number
    ) : Promise<AnswerResponse>{
        const errors = await answerValidator(null , id);
        if(errors?.length) return { status : false , errors};
        const answer = await Answer.findOne({id});
        return { status : true , answer }
    }

    @Mutation(() => AnswerResponse)
    // @UseMiddleware(isAuth,isCan("answer-create" , "Answer"))
    async createAnswer(
        @Arg('input') input: AnswerInput,
    ) : Promise<AnswerResponse>{
        const errors = await answerValidator(input , null);
        if(errors?.length) return { status : false , errors};
        await Answer.create({...input}).save();
        return {status : true};
    }

    @Mutation(() => AnswerResponse)
    // @UseMiddleware(isAuth,isCan("answer-update" , "Answer"))
    async updateAnswer(
        @Arg('id' , () => Int) id: number,
        @Arg('input') input: AnswerInput,
    ) : Promise<AnswerResponse>{
        const errors = await answerValidator(input , id);
        if(errors?.length) return { status : false , errors};
        await Answer.update({id},{...input});
        return {status : true };
    }

    @Mutation(() => AnswerResponse)
    // @UseMiddleware(isAuth,isCan("survey-delete" , "Survey"))
    async activeOrDeactiveAnswer(
        @Arg('id' , () => Int) id: number,
        @Arg('status') status: boolean,
    ) : Promise<AnswerResponse>{
        const errors = await answerValidator(null , id);
        if(errors?.length) return { status : false , errors};
        await Answer.update({id},{ status });
        return {status : true};
    }
}