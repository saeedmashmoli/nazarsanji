import { Package } from '../entities/Package';
import { Arg, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root  } from 'type-graphql';
import {  FieldError } from './response';
// import { isAuth } from '../middlewares/isAuthMiddleware';
// import {isCan} from '../middlewares/isCanMiddleware';
import { PackageInput } from './Input';
import { packageValidator } from '../validators/packageValidator';
import { getConnection } from 'typeorm';
import { Call } from '../entities/Call';

import {GraphQLUpload } from "graphql-upload";
import { jsonDataFromExcel, storeUpload } from '../utilis/storeFile';
import { Upload } from '../types';
import xlsx from 'xlsx'
import { Customer } from '../entities/Customer';
 





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
    @Field(() => [Package] , { nullable : true })
    packages?: Package[];
}


@Resolver(Package)
export class PackageResolver {
    
    
    @Mutation(() => PackagesResponse)
    // @UseMiddleware(isAuth,isCan("Package-show" , "Package"))
    async getPackages(
        @Arg('status') status: Boolean
    ) : Promise<PackagesResponse>{
        const packages = await getConnection().query(` 
            select s.* from package as s 
            where ${status ? "status = true" : "status = status"}
            order by s.id desc
        `);
        return {status : true , packages}
    }
    @Query(() => PackageResponse)
    // @UseMiddleware(isAuth,isCan("Package-show" , "Package"))
    async getPackage(
        @Arg('id' , () => Int) id : number
    ) : Promise<PackageResponse>{
        let errors = await packageValidator(null,id,null);
        if(errors?.length) return { status : false , errors};
        const p = await Package.findOne({id});
        return { status : true , package : p }
    }

    @Mutation(() => PackageResponse)
    // @UseMiddleware(isAuth,isCan("Package-create" , "Package"))
    async createPackage(
        @Arg('input') input: PackageInput,
        @Arg('file' , () => GraphQLUpload ,{nullable : true}) file: Upload
    ) : Promise<PackageResponse>{

        let errors = await packageValidator(input,null,file);
        if(errors?.length) return { status : false , errors};
        const p = await Package.create({...input}).save();
        if(file){
            let path = __dirname + "../../../static/files/excels/";
            const dir = await storeUpload(file,path);
            setTimeout(async() => {
                const data = await jsonDataFromExcel(dir)
                if(data?.length){
                    await data.forEach(async(call: any) => {
                        let customer = await Customer.findOne({where:{mobile : call.mobile}});
                        if(!customer){
                            const {mobile,name,phone} = call
                            customer = await Customer.create({mobile : mobile.trim(),name :name.trim(),phone : phone.trim()}).save();
                        }
                        await Call.create({...call,customerId:customer.id , packageId : p.id}).save()
                    })
                }
            },100) 
        }


        
        return { status: true };
    }

    @Mutation(() => PackageResponse)
    // @UseMiddleware(isAuth,isCan("Package-update" , "Package"))
    async updatePackage(
        @Arg('id' , () => Int) id: number,
        @Arg('input') input: PackageInput,
        @Arg('file' , () => GraphQLUpload ,{nullable : true}) file: Upload
    ) : Promise<PackageResponse>{
        let errors = await packageValidator(input,id,file);
        if(errors?.length) return { status : false , errors};
        await Package.update({id} , {...input});
        return { status: true};
    }

    @Mutation(() => PackageResponse)
    // @UseMiddleware(isAuth,isCan("Package-delete" , "Package"))
    async activeOrDeactivePackage(
        @Arg('id' , () => Int) id: number,
        @Arg('status') status: boolean
    ) : Promise<PackageResponse>{
        let errors = await packageValidator(null,id,null);
        if(errors?.length) return { status : false , errors};
        await Package.update({id},{ status });
        return {status : true};
    }
}