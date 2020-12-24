import { Sms } from '../entities/Sms';
import { Arg, Ctx, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root  } from 'type-graphql';
import {  FieldError } from './response';
// import { isAuth } from '../middlewares/isAuthMiddleware';
// import {isCan} from '../middlewares/isCanMiddleware';
import { SmsInput, SmsSearchInput } from './Input';
import { smsValidator } from '../validators/smsValidator';
import { Package } from '../entities/Package';
import { getConnection } from 'typeorm';
import { Call } from '../entities/Call';
import { Template } from '../entities/Template';
import sms from '../constants/sms';
import { generateUniqueString } from '../constants/functions';
import { MyContext } from '../types';
import { Log } from '../entities/Log';



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
            let link = template.isDynamicLink ? template.link + token : template.link
            await data.push({"Parameter" : "link" , "ParameterValue" : link })
        }

        const response = await sms.ultraFastSend(call.mobile,template.tempNumber,data) as any;
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

    @Query(() => PackagesAndTemplatesResponse)
    async getPackagesAndTemplatesForCreateSms() : Promise<PackagesAndTemplatesResponse> {
        const templates = await Template.find({where : {status : true}});
        const packages = await Package.find({where : {status : true}}); 
        return {status : true , templates , packages}
    }
    
    @Mutation(() => SendsResponse)
    // @UseMiddleware(isAuth,isCan("sms-show" , "Sms"))
    async getSends(
        @Arg('limit', () => Int, {nullable : true}) limit: number,
        @Arg('page', () => Int,{nullable : true}) page: number,
        @Arg('input') input: SmsSearchInput,
    ) : Promise<SendsResponse>{
        const { status , name , mobile, phone , packageId, templateId , callId , customerId , used , isSuccess } = input;
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
        `;
        const t = await getConnection().query(`select count(*) as 'count' ${query}`);
        const sends = await getConnection().query(`select s.* ${query} order by id desc limit ${skip},${take}`);
     
        const total = t[0].count;
        let pages = Math.floor((total % take > 0) ? (total / take) + 1 : (total / take)) as number
        return {status : true , docs : {sends , total , page : currentPage , pages}}
    }
    @Query(() => SendResponse)
    // @UseMiddleware(isAuth,isCan("sms-show" , "Sms"))
    async getSms(
        @Arg('id' , () => Int) id : number
    ) : Promise<SendResponse>{
        let errors = await smsValidator(null,id);
        if(errors?.length) return { status : false , errors};
        const send = await Sms.findOne({id});

        return { status : true , send }
    }

    @Mutation(() => SendResponse)
    // @UseMiddleware(isAuth,isCan("sms-create" , "Sms"))
    async createSms(
        @Arg('input') input: SmsInput,
        @Ctx() { payload} : MyContext
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
            select c.*,cu.mobile,cu.customer from ${"`call`"} as c 
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
                console.log(token)
                const response = await this.sendSms(template , call , token) as any;
                let isSuccess = response?.IsSuccessful;
                let code = response?.VerificationCodeId;
                let message = response?.Message;
                const sms = await Sms.create({callId : call.id , templateId : template.id , token , isSuccess , code , surveyId , message}).save();
                const data = {
                    userId : payload?.userId ,
                    modelId : 9 ,
                    operation : `create : ${sms}`,
                    rowId : sms?.id 
                } as any
                await Log.create({...data}).save();
            }
        })


        // create sms
        // await Sms.create({...input}).save();
        
        return { status: true };
       
    }

    @Mutation(() => SendResponse)
    // @UseMiddleware(isAuth,isCan("sms-delete" , "Sms"))
    async activeOrDeactiveSms(
        @Arg('id' , () => Int) id: number,
        @Arg('status') status: boolean,
        @Ctx() {payload} : MyContext
    ) : Promise<SendResponse>{
        const errors = await smsValidator(null,id);
        if(errors?.length) return { status : false , errors};
        await Sms.update({id},{ status });
        const data = {
            userId : payload?.userId ,
            modelId : 9 ,
            operation : `activeOrDeactive : ${sms}`,
            rowId : id 
        } as any
        await Log.create({...data}).save();
        return {status : true};
    }
}