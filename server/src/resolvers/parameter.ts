import { Parameter } from '../entities/Parameter';
import { Arg, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver ,UseMiddleware } from 'type-graphql';
import {  FieldError } from './response';
import { isAuth } from '../middlewares/isAuthMiddleware';
import {isCan} from '../middlewares/isCanMiddleware';
import { ParameterInput, ParameterSearchInput } from './Input';
import { parameterValidator } from '../validators/parameterValidator';
import { getConnection } from 'typeorm';
import { MyContext } from '../types';
import { createLog } from '../constants/functions';



@ObjectType()
export class ParameterResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => Parameter , { nullable : true })
    parameter?: Parameter;
}
@ObjectType()
export class PaginatedParameters {
    @Field()
    total: number;
    @Field()
    page!: number;
    @Field()
    pages!: number;
    @Field(() => [Parameter] , { nullable : true })
    parameters?: Parameter[];
}
@ObjectType()
export class ParametersResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => PaginatedParameters , { nullable : true })
    docs?: PaginatedParameters;
}

@Resolver(Parameter)
export class ParameterResolver {
    
    @Mutation(() => ParametersResponse)
    @UseMiddleware(isAuth,isCan("show-parameter" , "Parameter"))
    async getParameters(
        @Arg('limit', () => Int, {nullable : true}) limit: number,
        @Arg('page', () => Int,{nullable : true}) page: number,
        @Arg('input', {nullable : true}) input: ParameterSearchInput
    ) : Promise<ParametersResponse>{
        const { status , title , label } = input;
        let currentPage = page || 1;
        let take = limit || 10;
        let skip = (currentPage - 1) * take;
        let query = `from parameter as s 
        where ${status ? `status = ${status}` : "status = status"}
        ${title ? `and title like '%${title}%' `: ""}
        ${label ? `and label like '%${label}%' `: ""}` ;
        const t = await getConnection().query(`select count(*) as 'count' ${query}`);
        const parameters = await getConnection().query(`select s.* ${query} order by id desc limit ${skip},${take}`);
        let pages = Math.floor((t[0].count % take > 0) ? (t[0].count / take) + 1 : (t[0].count / take)) as number
        return { status : true , docs : { parameters , total :t[0].count , page : currentPage , pages }}
    }
    @Query(() => ParameterResponse)
    @UseMiddleware(isAuth,isCan("show-parameter" , "Parameter"))
    async getParameter(
        @Arg('id' , () => Int) id : number
    ) : Promise<ParameterResponse>{
        const errors = await parameterValidator(null, id);
        if(errors?.length) return { status : false , errors};
        const parameter = await Parameter.findOne({id});
        return { status : true , parameter }
    }

    @Mutation(() => ParameterResponse)
    @UseMiddleware(isAuth,isCan("create-parameter" , "Parameter"))
    async createParameter(
        @Arg('input') input: ParameterInput,
        @Ctx() { payload } : MyContext
    ) : Promise<ParameterResponse>{
        const errors = await parameterValidator(input);
        if(errors?.length) return { status : false , errors};
        const parameter =  await Parameter.create({...input}).save();
        await createLog(payload?.userId as number , 8 , "create" , parameter , parameter.id);
        return { status: true };
    }

    @Mutation(() => ParameterResponse)
    @UseMiddleware(isAuth,isCan("update-parameter" , "Parameter"))
    async updateParameter(
        @Arg('id' , () => Int) id: number,
        @Arg('input') input: ParameterInput,
        @Ctx() { payload } : MyContext
    ) : Promise<ParameterResponse>{
        let errors = await parameterValidator(input , id);
        if(errors?.length) return { status : false , errors};
        await Parameter.update({id} , {...input});
        const parameter = await Parameter.findOne({id});
        await createLog(payload?.userId as number , 8 , "edit" , parameter , id);
        return { status: true };
    }

    @Mutation(() => ParameterResponse)
    @UseMiddleware(isAuth,isCan("status-parameter" , "Parameter"))
    async activeOrDeactiveParameter(
        @Arg('id' , () => Int) id: number,
        @Arg('status') status: boolean,
        @Ctx() { payload } : MyContext
    ) : Promise<ParameterResponse>{
        const errors = await parameterValidator(null, id);
        if(errors?.length) return { status : false , errors};
        await Parameter.update({id},{ status });
        const parameter = await Parameter.findOne({id});
        await createLog(payload?.userId as number , 8 , "activeOrDeactive" , parameter , id);
        return {status : true};
    }
}
