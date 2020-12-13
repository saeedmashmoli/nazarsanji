import { Question } from '../entities/Question';
import { Arg, Field, FieldResolver, Mutation, ObjectType, Query, Resolver, Root  } from 'type-graphql';
// import { isAuth } from '../middlewares/isAuthMiddleware';
// import {isCan} from '../middlewares/isCanMiddleware';
import { QuestionInput } from './Input';
import { FieldError } from './response';
import { questionValidator , updateOrDeleteQuestionValidator } from '../validators/questionValidator';
import { Survey } from '../entities/Survey';
import { Type } from '../entities/Type';


@ObjectType()
export class QuestionResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => Question , { nullable : true })
    question?: Question;
}

@Resolver(Question)
export class QuestionResolver {
    
    @FieldResolver(() => Question)
    survey( 
      @Root() question : Question,
    ){return Survey.findOne(question.surveyId)}

    @FieldResolver(() => Question)
    type( 
      @Root() question : Question,
    ){return Type.findOne(question.typeId)}

    @Query(() => [Question])
    // @UseMiddleware(isAuth,isCan("question-show" , "Question"))
    async getQuestions(
    ) : Promise<Question[]>{
        return await Question.find({where : {status : true}})
    }

    @Mutation(() => QuestionResponse)
    // @UseMiddleware(isAuth,isCan("question-create" , "Question"))
    async createQuestion(
        @Arg('input') input: QuestionInput,
    ) : Promise<QuestionResponse>{
        const errors = await questionValidator(input);
        if(errors?.length) return { status : false , errors};
        const question = await Question.create({...input}).save();
        return {status : true , question };
    }

    @Mutation(() => QuestionResponse)
    // @UseMiddleware(isAuth,isCan("question-update" , "Question"))
    async updateQuestion(
        @Arg('id') id: number,
        @Arg('input') input: QuestionInput,
    ) : Promise<QuestionResponse>{
        let errors = await questionValidator(input);
        if(errors?.length) return { status : false , errors};
        errors = await updateOrDeleteQuestionValidator(id);
        if(errors?.length) return { status : false , errors};

        await Question.update({id},{...input});
        const question = await Question.findOne({id})

        return {status : true , question};
    }

    @Mutation(() => QuestionResponse)
    // @UseMiddleware(isAuth,isCan("question-delete" , "Question"))
    async deleteQuestion(
        @Arg('id') id: number,
    ) : Promise<QuestionResponse>{
        const errors = await updateOrDeleteQuestionValidator(id);
        if(errors?.length) return { status : false , errors};
        await Question.update({id},{ status : false });
        return {status : true };
    }
}