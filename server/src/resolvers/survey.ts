import { Survey } from '../entities/Survey';
import { Arg, Field, Int, Mutation, ObjectType, Query, Resolver  } from 'type-graphql';
import {  FieldError } from './response';
// import { isAuth } from '../middlewares/isAuthMiddleware';
// import {isCan} from '../middlewares/isCanMiddleware';
import { SurveyInput } from './Input';
import { surveyValidator, updateOrDeleteSurveyValidator } from '../validators/surveyValidator';
import { getConnection } from 'typeorm';


@ObjectType()
export class SurveyResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => Survey , { nullable : true })
    survey?: Survey;
}
@ObjectType()
export class SurveysResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => [Survey] , { nullable : true })
    surveys?: Survey[];
}

@Resolver()
export class SurveyResolver {
    
    @Mutation(() => SurveysResponse)
    // @UseMiddleware(isAuth,isCan("survey-show" , "Survey"))
    async getSurveys(
        @Arg('status') status: Boolean
    ) : Promise<SurveysResponse>{
        const surveys = await getConnection().query(` 
            select s.* from survey as s 
            where ${status ? "status = true" : "status = status"}
            order by s.id desc
        `);
        return {status : true , surveys}
    }
    @Query(() => SurveyResponse)
    // @UseMiddleware(isAuth,isCan("survey-show" , "Survey"))
    async getSurvey(
        @Arg('id' , () => Int) id : number
    ) : Promise<SurveyResponse>{
        const survey = await Survey.findOne({id});
        if(!survey){
            return { status : false , errors : [
                {
                    field : 'id',
                    message : 'نظرسنجی مورد نظر یافت نشد'
                }
            ]}
        }

        return { status : true , survey }
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
    async activeOrDeactiveSurvey(
        @Arg('id' , () => Int) id: number,
    ) : Promise<SurveyResponse>{
        const errors = await updateOrDeleteSurveyValidator(id);
        if(errors?.length) return { status : false , errors};
        const survey = await Survey.findOne({id});
        await Survey.update({id},{ status : !survey?.status });
        return {status : true};
    }
}