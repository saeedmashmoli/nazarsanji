import { Sms } from '../entities/Sms';
import { Arg, Ctx, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware  } from 'type-graphql';
import {  FieldError } from './response';
import { isAuth } from '../middlewares/isAuthMiddleware';
import {isCan} from '../middlewares/isCanMiddleware';
import { SmsInput, SmsSearchInput } from './Input';
import { smsValidator } from '../validators/smsValidator';
import { Package } from '../entities/Package';
import { getConnection } from 'typeorm';
import { Call } from '../entities/Call';
import { Template } from '../entities/Template';
import sms from '../constants/sms';
import { convertJalaaliToGregorianDate, generateUniqueString } from '../constants/functions';
import { MyContext } from '../types';
import { Survey } from '../entities/Survey';
import { createLog } from '../constants/functions';


@ObjectType()
export class PaginatedSends {
    @Field()
    total: number;
    @Field()
    page!: number;
    @Field()
    pages!: number;
    @Field(() => [Sms] , { nullable : true })
    sends?: Sms[];
}

@ObjectType()
export class SendResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => Sms , { nullable : true })
    send?: Sms;
}
@ObjectType()
export class SendsResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => PaginatedSends , { nullable : true })
    docs?: PaginatedSends;
}

@ObjectType()
export class PackagesAndTemplatesResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => [Template] , { nullable : true })
    templates?: Template[];
    @Field(() => [Package] , { nullable : true })
    packages?: Package[];
    @Field(() => [Survey] , { nullable : true })
    surveys?: Survey[];
}


@Resolver(Sms)
export class SmsResolver {
    protected async sendSms(template: Template , call : any , token : string) {
        let parameters = await getConnection().query(`
        select * from parameter as p
        left join parameter_template as t
        on p.id = t.parameterId
        where t.templateId = ${template?.id}
        `);

        let data = [];
        parameters.forEach((param : any) => {
            for (let [key, value] of Object.entries(call)) {
                if (key == param.title) {
                    data.push({"Parameter" : key , "ParameterValue" : value})
                }
            }
        })
        if(template.link){
            let link = template.isDynamicLink ? template.link + token : template.link;
            await data.push({"Parameter" : "link" , "ParameterValue" : link })
        }
        
        let response;
        if(template.tempNumber !== 0){
            response = await sms.ultraFastSend(call.mobile,template.tempNumber,data) as any;
        }else{
            let body = template.body;
            await data.forEach(async(obj) => {
                body = body?.replace(`[${obj.Parameter}]`,obj.ParameterValue);
            })
            response = await sms.sendMessage(body as string,call.mobile)as any;
        }
        
        return response;
    }

    @FieldResolver(() => Call)
    call( 
      @Root() send : Sms,
    ){return Call.findOne(send.callId)}

    @FieldResolver(() => Package)
    template( 
        @Root() send : Sms,
    ){return Template.findOne(send.templateId)}
    @FieldResolver(() => Survey)
    survey( 
        @Root() send : Sms,
    ){return Survey.findOne(send.surveyId)}

    @Query(() => PackagesAndTemplatesResponse)
    async getOptionsForCreateSms() : Promise<PackagesAndTemplatesResponse> {
        const templates = await Template.find({where : {status : true}});
        const packages = await Package.find({where : {status : true}}); 
        const surveys = await Survey.find({where : {status : true}});
        return {status : true , templates , packages , surveys}
    }
    
    @Mutation(() => SendsResponse)
    @UseMiddleware(isAuth,isCan("show-sms" , "Sms"))
    async getSends(
        @Arg('limit', () => Int, {nullable : true}) limit: number,
        @Arg('page', () => Int,{nullable : true}) page: number,
        @Arg('input') input: SmsSearchInput,
    ) : Promise<SendsResponse>{
        const { status , name , mobile, phone , packageId, templateId , callId , customerId , used , isSuccess ,endDate,beginDate,beginTime ,endTime} = input;
        let bDate = await convertJalaaliToGregorianDate(beginDate + (beginTime ? " "+beginTime : " 00:00:00") as string);
        let eDate = await convertJalaaliToGregorianDate(endDate + (endTime ? " "+endTime : " 23:59:59") as string);
        const currentPage = page || 1;
        const take = limit || 10;
        const skip = (currentPage - 1) * take;
        const tableName = "`call`";
        const query = `from sms as s 
        ${name || mobile || phone || callId || customerId ? `
        left join ${tableName} as c on s.callId = c.id
        left join customer as cu on c.customerId = cu.id` : ""}
        where s.status = ${status ? status : "s.status"} 
        ${isSuccess ? ` and s.isSuccess = ${isSuccess} `: ""}
        ${templateId ? ` and s.templateId = ${templateId} `: ""}
        ${packageId ? ` and s.isSuccess = ${packageId} `: ""}
        ${callId ? ` and s.callId = ${callId} `: ""}
        ${customerId ? ` and c.customerId = ${customerId} `: ""}
        ${used ? `and s.used = ${used} ` : ""}
        ${mobile ? `and cu.mobile LIKE '%${mobile}%' ` : ""}
        ${phone ? `and cu.phone LIKE '%${phone}%' ` : ""}
        ${name ? `and cu.name LIKE '%${name}%' ` : ""}
        ${beginDate ? `and s.createdAt >= '${bDate}' ` : ""}
        ${endDate ? `and s.createdAt <= '${eDate}' ` : ""}
        `;
        const t = await getConnection().query(`select count(*) as 'count' ${query}`);
        const sends = await getConnection().query(`select s.* ${query} order by id desc limit ${skip},${take}`);
     
        const total = t[0].count;
        let pages = Math.floor((total % take > 0) ? (total / take) + 1 : (total / take)) as number
        return {status : true , docs : {sends , total , page : currentPage , pages}}
    }
    @Query(() => SendResponse)
    @UseMiddleware(isAuth,isCan("show-sms" , "Sms"))
    async getSms(
        @Arg('id' , () => Int) id : number
    ) : Promise<SendResponse>{
        let errors = await smsValidator(null,id);
        if(errors?.length) return { status : false , errors};
        const send = await Sms.findOne({id});

        return { status : true , send }
    }

    @Mutation(() => SendResponse)
    @UseMiddleware(isAuth,isCan("create-sms" , "Sms"))
    async createSms(
        @Arg('input') input: SmsInput,
        @Ctx() {payload} : MyContext
    ) : Promise<SendResponse>{
        let errors = await smsValidator(input,null);
        if(errors?.length) return { status : false , errors};
        let {packageId , templateId , surveyId } = input;
        const template = await Template.findOne({id : templateId});
        if(!template){
            return {
                status: false,
                errors : [
                    { message : "قالب مورد نظر یافت نشد" , field : "templateId"}
                ]
            }
        }
        const calls = await getConnection().query(`
            select c.*, cu.mobile , cu.name from ${"`call`"} as c 
            left join call_package as p
            on c.id = p.callId
            left join customer as cu
            on cu.id = c.customerId
            where p.packageId = ${packageId}
            order by id desc
        `);

        await calls.forEach( async(call : any) => {
            if(call.mobile){
                // send sms 
                let token = await generateUniqueString(6);
                const response = await this.sendSms(template , call , token);
                const callId = call.id as number;
                const templateId = template.id as number;
                let isSuccess = response?.IsSuccessful as boolean;
                let code = response?.VerificationCodeId as number;
                let message = response?.Message as string;
                const data = {callId, templateId, token , isSuccess, code , surveyId ,  message };
                await Sms.create({...data}).save();
            }
        })
        await createLog(payload?.userId as number , 9 , "create" , {...input} , input.templateId as number);
        return { status: true };
    }

    @Mutation(() => SendResponse)
    @UseMiddleware(isAuth,isCan("status-sms" , "Sms"))
    async activeOrDeactiveSms(
        @Arg('id' , () => Int) id: number,
        @Arg('status') status: boolean,
        @Ctx() {payload} : MyContext
    ) : Promise<SendResponse>{
        const errors = await smsValidator(null,id);
        if(errors?.length) return { status : false , errors};
        await Sms.update({id},{ status });
        const sms = await Sms.findOne({id});
        await createLog(payload?.userId as number , 9 , "activeOrDeactive" , sms , id);
        return {status : true};
    }
}
