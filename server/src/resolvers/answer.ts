import { Answer } from '../entities/Answer';
import { Arg, Field, FieldResolver, Mutation, ObjectType, Query, Resolver, Root  } from 'type-graphql';
// import { isAuth } from '../middlewares/isAuthMiddleware';
// import {isCan} from '../middlewares/isCanMiddleware';
import { AnswerInput } from './Input';
import { FieldError } from './response';
import { answerValidator , updateOrDeleteAnswerValidator } from '../validators/answerValidator';
import { Question } from '../entities/Question';

@ObjectType()
export class AnswerResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => Answer , { nullable : true })
    answer?: Answer;
}

@Resolver(Answer)
export class AnswerResolver {
    

    @FieldResolver(() => Answer)
    question( 
      @Root() answer : Answer,
    ){return Question.findOne(answer.questionId)}

    @Query(() => [Answer])
    // @UseMiddleware(isAuth,isCan("answer-show" , "Answer"))
    async getAnswers(
    ) : Promise<Answer[]>{
        return await Answer.find({where : {status : true}})
    }

    @Mutation(() => AnswerResponse)
    // @UseMiddleware(isAuth,isCan("answer-create" , "Answer"))
    async createAnswer(
        @Arg('input') input: AnswerInput,
    ) : Promise<AnswerResponse>{
        const errors = await answerValidator(input);
        if(errors?.length) return { status : false , errors};
        const answer = await Answer.create({...input}).save();
        return {status : true , answer};
    }

    @Mutation(() => AnswerResponse)
    // @UseMiddleware(isAuth,isCan("answer-update" , "Answer"))
    async updateAnswer(
        @Arg('id') id: number,
        @Arg('input') input: AnswerInput,
    ) : Promise<AnswerResponse>{
        let errors = await answerValidator(input);
        if(errors?.length) return { status : false , errors};
        errors = await updateOrDeleteAnswerValidator(id);
        if(errors?.length) return { status : false , errors};
        await Answer.update({id},{...input});
        const answer = await Answer.findOne({id})
        return {status : true , answer};
    }

    @Mutation(() => AnswerResponse)
    // @UseMiddleware(isAuth,isCan("answer-delete" , "Answer"))
    async deleteAnswer(
        @Arg('id') id: number,
    ) : Promise<AnswerResponse>{
        const errors = await updateOrDeleteAnswerValidator(id);
        if(errors?.length) return { status : false , errors};
        await Answer.update({id},{ status : false });
        return {status : true};
    }
}