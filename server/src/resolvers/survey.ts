import { Survey } from '../entities/Survey';
import { Arg, Field, Mutation, ObjectType, Query, Resolver  } from 'type-graphql';
import {  FieldError } from './response';
// import { isAuth } from '../middlewares/isAuthMiddleware';
// import {isCan} from '../middlewares/isCanMiddleware';
import { SurveyInput } from './Input';
import { surveyValidator, updateOrDeleteSurveyValidator } from '../validators/surveyValidator';


@ObjectType()
export class SurveyResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => Survey , { nullable : true })
    survey?: Survey;
}

@Resolver()
export class SurveyResolver {
    
    @Query(() => [Survey])
    // @UseMiddleware(isAuth,isCan("survey-show" , "Survey"))
    async getSurveys(
    ) : Promise<Survey[]>{
        return await Survey.find({where : {status : true}})
    }

    @Mutation(() => SurveyResponse)
    // @UseMiddleware(isAuth,isCan("survey-create" , "Survey"))
    async createSurvey(
        @Arg('input') input: SurveyInput,
    ) : Promise<SurveyResponse>{
        const errors = await surveyValidator(input);
        if(errors?.length) return { status : false , errors};
        const survey = await Survey.create({...input}).save();
        
        return { status: true , survey };
    }

    @Mutation(() => SurveyResponse)
    // @UseMiddleware(isAuth,isCan("survey-update" , "Survey"))
    async updateSurvey(
        @Arg('id') id: number,
        @Arg('input') input: SurveyInput,
    ) : Promise<SurveyResponse>{
        let errors = await surveyValidator(input);
        if(errors?.length) return { status : false , errors};
        errors = await updateOrDeleteSurveyValidator(id);
        if(errors?.length) return { status : false , errors};
        await Survey.update({id} , {...input});
        const survey = await Survey.findOne({id});
        return { status: true , survey };
    }

    @Mutation(() => SurveyResponse)
    // @UseMiddleware(isAuth,isCan("survey-delete" , "Survey"))
    async deleteSurvey(
        @Arg('id') id: number,
    ) : Promise<SurveyResponse>{
        const errors = await updateOrDeleteSurveyValidator(id);
        if(errors?.length) return { status : false , errors};
        await Survey.update({id},{ status : false });
        return {status : true};
    }
}