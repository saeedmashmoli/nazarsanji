import { Survey } from '../entities/Survey';
import { Arg, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver, UseMiddleware  } from 'type-graphql';
import {  FieldError } from './response';
// import { isAuth } from '../middlewares/isAuthMiddleware';
// import {isCan} from '../middlewares/isCanMiddleware';
import { SurveyInput, SurveySearchInput } from './Input';
import { surveyValidator } from '../validators/surveyValidator';
import { getConnection } from 'typeorm';
import { MyContext } from '../types';
import { Log } from '../entities/Log';


@ObjectType()
export class PaginatedSurveys {
    @Field()
    total!: number;
    @Field()
    page!: number;
    @Field()
    pages!: number;
    @Field(() => [Survey],{ nullable : true })
    surveys?: Survey[];
}

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
    @Field(() => PaginatedSurveys , { nullable : true })
    docs?: PaginatedSurveys;
}

@Resolver()
export class SurveyResolver {
    
    @Mutation(() => SurveysResponse)
    // @UseMiddleware(isAuth,isCan("survey-show" , "Survey"))
    async getSurveys(
        @Arg('limit', () => Int, {nullable : true}) limit: number,
        @Arg('page', () => Int,{nullable : true}) page: number,
        @Arg('input') input: SurveySearchInput,
    ) : Promise<SurveysResponse>{
        const { status , title , questionId , smsId } = input;
        const currentPage = page || 1;
        const take = limit || 10;
        const skip = (currentPage - 1) * take;
        const tableName = "`survey`";
        const query = `from ${tableName} as s 
        ${questionId ? `left join question as q on q.surveyId = s.id` : ""}
        ${smsId ? `left join sms as a on a.surveyId = s.id` : ""}
        where s.status = ${status ? status : "s.status"} 
        ${smsId ? `and a.id = ${smsId}` : ""}
        ${questionId ? `and q.id = ${questionId}` : ""}
        ${title ? ` and s.title LIKE '%${title}%' `: ""}
        `;
        const t = await getConnection().query(`select count(*) as 'count' ${query}`);
        const surveys = await getConnection().query(`select s.* ${query} order by id desc limit ${skip},${take}`);
        const total = t[0].count;
        let pages = Math.floor((total % take > 0) ? (total / take) + 1 : (total / take)) as number

        return {status : true , docs : {surveys , total , page : currentPage , pages}}
    }
    @Query(() => SurveyResponse)
    // @UseMiddleware(isAuth,isCan("survey-show" , "Survey"))
    async getSurvey(
        @Arg('id' , () => Int) id : number
    ) : Promise<SurveyResponse>{
        const errors = await surveyValidator(null, id);
        if(errors?.length) return { status : false , errors};
        const survey = await Survey.findOne({id});
        return { status : true , survey }
    }

    @Mutation(() => SurveyResponse)
    // @UseMiddleware(isAuth,isCan("survey-create" , "Survey"))
    async createSurvey(
        @Arg('input') input: SurveyInput,
        @Ctx() {payload} : MyContext
    ) : Promise<SurveyResponse>{
        const errors = await surveyValidator(input);
        if(errors?.length) return { status : false , errors};
        const survey = await Survey.create({...input}).save();


        return { status: true };
    }

    @Mutation(() => SurveyResponse)
    // @UseMiddleware(isAuth,isCan("survey-update" , "Survey"))
    async updateSurvey(
        @Arg('id' , () => Int) id: number,
        @Arg('input') input: SurveyInput,
        @Ctx() {payload} : MyContext
    ) : Promise<SurveyResponse>{
        let errors = await surveyValidator(input , id);
        if(errors?.length) return { status : false , errors};
        const survey = await Survey.update({id} , {...input});
 
   
        return { status: true };
    }

    @Mutation(() => SurveyResponse)
    // @UseMiddleware(isAuth,isCan("survey-delete" , "Survey"))
    async activeOrDeactiveSurvey(
        @Arg('id' , () => Int) id: number,
        @Arg('status') status: boolean,
        // @Ctx() {payload} : MyContext
    ) : Promise<SurveyResponse>{
        const errors = await surveyValidator(null, id);
        if(errors?.length) return { status : false , errors};
        await Survey.update({id},{ status });

        return {status : true};
    }
}

        // const data = {
        //     userId : payload?.userId ,
        //     modelId : 1 ,
        //     operation : `create : ${survey}`,
        //     rowId : survey.id 
        // } as any
        // await Log.create({...data}).save();