import { Package } from '../entities/Package';
import { Arg, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root  } from 'type-graphql';
import {  FieldError } from './response';
// import { isAuth } from '../middlewares/isAuthMiddleware';
// import {isCan} from '../middlewares/isCanMiddleware';
import { PackageInput } from './Input';
import { packageValidator, updateOrDeletePackageValidator } from '../validators/packageValidator';
import { getConnection } from 'typeorm';
import { Call } from '../entities/Call';


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
    
    @FieldResolver(() => [Call])
    calls( 
      @Root() p : Package,
    ){return Call.find({where : {packageId :p.id}})}
    
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
        let e = await updateOrDeletePackageValidator(id);
        if(e?.length) return { status : false , errors : e};
        const p = await Package.findOne({id});

        return { status : true , package : p }
    }

    @Mutation(() => PackageResponse)
    // @UseMiddleware(isAuth,isCan("Package-create" , "Package"))
    async createPackage(
        @Arg('input') input: PackageInput,
    ) : Promise<PackageResponse>{
        const errors = await packageValidator(input);
        if(errors?.length) return { status : false , errors};
        const p = await Package.create({...input}).save();
        
        return { status: true , package : p };
    }

    @Mutation(() => PackageResponse)
    // @UseMiddleware(isAuth,isCan("Package-update" , "Package"))
    async updatePackage(
        @Arg('id' , () => Int) id: number,
        @Arg('input') input: PackageInput,
    ) : Promise<PackageResponse>{
        let errors = await packageValidator(input);
        if(errors?.length) return { status : false , errors};
        errors = await updateOrDeletePackageValidator(id);
        if(errors?.length) return { status : false , errors};
        await Package.update({id} , {...input});
        const p = await Package.findOne({id});
        return { status: true , package : p };
    }

    @Mutation(() => PackageResponse)
    // @UseMiddleware(isAuth,isCan("Package-delete" , "Package"))
    async activeOrDeactivePackage(
        @Arg('id' , () => Int) id: number,
    ) : Promise<PackageResponse>{
        const errors = await updateOrDeletePackageValidator(id);
        if(errors?.length) return { status : false , errors};
        const p = await Package.findOne({id});
        await Package.update({id},{ status : !p?.status });
        return {status : true};
    }
}