import { Package } from '../entities/Package';
import { Arg, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver , UseMiddleware } from 'type-graphql';
import {  FieldError } from './response';
import { isAuth } from '../middlewares/isAuthMiddleware';
import {isCan} from '../middlewares/isCanMiddleware';
import { PackageInput, PackageSearchInput } from './Input';
import { packageValidator } from '../validators/packageValidator';
import {  getConnection } from 'typeorm';
import { Call } from '../entities/Call';
import {GraphQLUpload } from "graphql-upload";
import { jsonDataFromExcel, storeUpload } from '../utilis/storeFile';
import { MyContext, Upload } from '../types';
import { Customer } from '../entities/Customer';
import { checkObjectField, createLog } from '../constants/functions';
import { CallPackage } from '../entities/CallPackage';
 
@ObjectType()
export class PaginatedPackages {
    @Field()
    total!: number;
    @Field()
    page!: number;
    @Field()
    pages!: number;
    @Field(() => [Package],{ nullable : true })
    packages?: Package[];
}

@ObjectType()
export class PackageResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => Package , { nullable : true })
    package?: Package;
}
@ObjectType()
export class PackagesResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => PaginatedPackages , { nullable : true })
    docs?: PaginatedPackages;
}

const createRecordCall = async (file : Upload , packageId : number ) => {
    let path = __dirname + "../../../static/files/excels/";
    const dir = await storeUpload(file,path);
    setTimeout(async() => {
        const data = await jsonDataFromExcel(dir)
        if(data?.length){
            data.forEach(async(call: any) => {
                call =  await checkObjectField(call)
                let { mobile , name , phone } = call;
                if(typeof mobile === "number") {mobile = undefined }
                let customer =  await Customer.findOne({where:{mobile}})
                if(!customer){
                    customer = await Customer.create({mobile, name, phone}).save();
                }
                const newCall =  await Call.create({...call,customerId:customer.id}).save();

                await CallPackage.create({callId : newCall.id , packageId}).save()
            })
        }
    },100) 
}


@Resolver(Package)
export class PackageResolver {
        
    @Mutation(() => PackagesResponse)
    @UseMiddleware(isAuth,isCan("show-package" , "Package"))
    async getPackages(
        @Arg('limit', () => Int, {nullable : true}) limit: number,
        @Arg('page', () => Int,{nullable : true}) page: number,
        @Arg('input') input: PackageSearchInput,
    ) : Promise<PackagesResponse>{
        const { status , title , callId } = input;
        const currentPage = page || 1;
        const take = limit || 10;
        const skip = (currentPage - 1) * take;
        const tableName = "`package`";
        const query = `from ${tableName} as s 
        ${callId ? `left join call_package as cp on cp.packageId = s.id` : ""}
        where s.status = ${status ? status : "s.status"} 
        ${callId ? `and cp.callId = ${callId}` : ""}
        ${title ? ` and s.title LIKE '%${title}%' `: ""}
        `;
        const t = await getConnection().query(`select count(*) as 'count' ${query}`);
        const p = await getConnection().query(`select s.* ${query} order by id desc limit ${skip},${take}`);
        const total = t[0].count;
        let pages = Math.floor((total % take > 0) ? (total / take) + 1 : (total / take)) as number

        return {status : true , docs : {packages : p , total , page : currentPage , pages}}
    }
    @Query(() => PackageResponse)
    @UseMiddleware(isAuth,isCan("show-package" , "Package"))
    async getPackage(
        @Arg('id' , () => Int) id : number
    ) : Promise<PackageResponse>{
        let errors = await packageValidator(null,id,null);
        if(errors?.length) return { status : false , errors};
        const p = await Package.findOne({id});
        return { status : true , package : p }
    }

    @Mutation(() => PackageResponse)
    @UseMiddleware(isAuth,isCan("create-package" , "Package"))
    async createPackage(
        @Arg('input') input: PackageInput,
        @Arg('file' , () => GraphQLUpload ,{nullable : true}) file: Upload,
        @Ctx() {payload} : MyContext
    ) : Promise<PackageResponse>{
        let errors = await packageValidator(input,null,file);
        if(errors?.length) return { status : false , errors};
        const p = await Package.create({...input}).save();
        if(file){
            if(file){
                createRecordCall(file,p.id );
            }
        }
        await createLog(payload?.userId as number , 4 , "create" , p , p.id);
        return { status: true };
    }

    @Mutation(() => PackageResponse)
    @UseMiddleware(isAuth,isCan("update-package" , "Package"))
    async updatePackage(
        @Arg('id' , () => Int) id: number,
        @Arg('input') input: PackageInput,
        @Arg('file' , () => GraphQLUpload ,{nullable : true}) file: Upload,
        @Ctx() {payload} : MyContext
    ) : Promise<PackageResponse>{
        let errors = await packageValidator(input,id,file);
        if(errors?.length) return { status : false , errors};
        await Package.update({id} , {...input});
        const p = await Package.findOne({id});
        await createLog(payload?.userId as number , 4 , "edit" , p , id);
        if(file){
            createRecordCall(file,id);
        }
        return { status: true};
    }

    @Mutation(() => PackageResponse)
    @UseMiddleware(isAuth,isCan("status-package" , "Package"))
    async activeOrDeactivePackage(
        @Arg('id' , () => Int) id: number,
        @Arg('status') status: boolean,
        @Ctx() {payload} : MyContext
    ) : Promise<PackageResponse>{
        let errors = await packageValidator(null,id,null);
        if(errors?.length) return { status : false , errors};
        await Package.update({id},{ status });
        const p = await Package.findOne({id});
        await createLog(payload?.userId as number , 4 , "activeOrDeactive" , p , id);
        return {status : true};
    }
}

