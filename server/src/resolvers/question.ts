import { Question } from '../entities/Question';
import { Arg, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root  } from 'type-graphql';
// import { isAuth } from '../middlewares/isAuthMiddleware';
// import {isCan} from '../middlewares/isCanMiddleware';
import { QuestionInput } from './Input';
import { FieldError } from './response';
import { questionValidator } from '../validators/questionValidator';
import { Survey } from '../entities/Survey';
import { Type } from '../entities/Type';
import { getConnection } from 'typeorm';


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
    @Field(() => [Question] , { nullable : true })
    questions?: Question[];
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

    @Query(() => TypesResponse)
    async getTypes() : Promise<TypesResponse>{
        const types = await Type.find({})
        return {status : true , types};
    }

    @Query(() => QuestionResponse)
    // @UseMiddleware(isAuth,isCan("survey-show" , "Survey"))
    async getQuestion(
        @Arg('id' , () => Int) id : number
    ) : Promise<QuestionResponse>{
        const errors = await questionValidator(null , id);
        if(errors?.length) return { status : false , errors};
        const question = await Question.findOne({id});
        return { status : true , question }
    }

    @Mutation(() => QuestionsResponse)
    // @UseMiddleware(isAuth,isCan("question-show" , "Question"))
    async getQuestions(
        @Arg('status') status: Boolean
    ) : Promise<QuestionsResponse>{
        const questions = await getConnection().query(` 
            select q.* from question as q 
            where ${status ? "status = true" : "status = status"}
            order by q.id desc
        `);
        return {questions , status : true}
    }

    @Mutation(() => QuestionResponse)
    // @UseMiddleware(isAuth,isCan("question-create" , "Question"))
    async createQuestion(
        @Arg('input') input: QuestionInput,
    ) : Promise<QuestionResponse>{
        const errors = await questionValidator(input);
        if(errors?.length) return { status : false , errors};
        await Question.create({...input}).save();
        return {status : true };
    }

    @Mutation(() => QuestionResponse)
    // @UseMiddleware(isAuth,isCan("question-update" , "Question"))
    async updateQuestion(
        @Arg('id' ,() => Int) id: number,
        @Arg('input') input: QuestionInput,
    ) : Promise<QuestionResponse>{
        let errors = await questionValidator(input , id);
        if(errors?.length) return { status : false , errors};
        await Question.update({id},{...input});
        return {status : true};
    }

    @Mutation(() => QuestionResponse)
    // @UseMiddleware(isAuth,isCan("survey-delete" , "Survey"))
    async activeOrDeactiveQuestion(
        @Arg('id' , () => Int) id: number,
        @Arg('status') status: boolean
    ) : Promise<QuestionResponse>{
        const errors = await questionValidator(null, id);
        if(errors?.length) return { status : false , errors};
        await Question.update({id},{ status });
        return {status : true};
    }
}