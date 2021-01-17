import { Arg, Field, ObjectType, Query, Resolver } from "type-graphql";
import { FieldError } from "./response";
import {  getConnection, In, Not } from "typeorm";
import { CommentReportInput } from "./Input";
import { convertJalaaliToGregorianDate } from "../constants/functions";
import { Survey } from "../entities/Survey";
import { Sms } from "../entities/Sms";
import { Question } from "../entities/Question";

@ObjectType()
export class DataCommentReportResponse {
    @Field(() => String,{nullable : true})
    value?: string;
    @Field(() => String,{nullable : true})
    label?: string;
}
@ObjectType()
export class CommentReportResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => [DataCommentReportResponse],{nullable : true})
    data?: DataCommentReportResponse[];
}

@ObjectType()
export class SmsReportResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => [Sms],{nullable : true})
    data?: Sms[];
}

@Resolver()
export class ReportResolver {
    @Query(() => [Survey])
    async getSurveysForReports() : Promise<Survey[]>{
        const surveys = await Survey.find({ order: { id: "DESC"} });
        return surveys;
    }
    @Query(() => CommentReportResponse)
    async getDataForCommentReport(
        @Arg('input') input : CommentReportInput 
    ) : Promise<CommentReportResponse>{
        let { surveyId,endDate,beginDate,beginTime ,endTime,questionId } = input;
        if(!surveyId){ 
            const surveys = await Survey.find({order: { id: "DESC"} , take: 1});
            surveyId = surveys[0].id;
            const questions = await Question.find({where : {surveyId , typeId : Not(In([5,6,3]))},order: { id: "DESC"} , take: 1});
            questionId = questions[0].id;
        }
        let bDate = await convertJalaaliToGregorianDate(beginDate + (beginTime ? " "+beginTime : " 00:00:00") as string);
        let eDate = await convertJalaaliToGregorianDate(endDate + (endTime ? " "+endTime : " 23:59:59") as string);
        const data = await getConnection().query(`
            select a.title as 'label',count(*) as 'value' 
            from comment as c
            left join sms as s on c.smsId = s.id
            left join answer as a on a.id = c.answerId
            where s.surveyId = ${surveyId}
            ${questionId ? `and c.questionId = ${questionId} ` : ""}
            ${beginDate ? `and c.createdAt >= '${bDate}' ` : ""}
            ${endDate ? `and c.createdAt <= '${eDate}' ` : ""}
            group by c.answerId,a.title
        `);
        console.log(data)
        return {status : true ,data}
    }
}