import { Call } from '../entities/Call';
import { Arg, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root  } from 'type-graphql';
import {  FieldError } from './response';
// import { isAuth } from '../middlewares/isAuthMiddleware';
// import {isCan} from '../middlewares/isCanMiddleware';
import { CallInput, CallSearchInput } from './Input';
import { callValidator} from '../validators/callValidator';
import { Customer } from '../entities/Customer';
import { Package } from '../entities/Package';
import { getConnection } from 'typeorm';


@ObjectType()
export class PaginatedCalls {
    @Field()
    total: number;
    @Field()
    page!: number;
    @Field()
    pages!: number;
    @Field(() => [Call] , { nullable : true })
    calls?: Call[];
}

@ObjectType()
export class CallResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => Call , { nullable : true })
    call?: Call;
}
@ObjectType()
export class CallsResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => PaginatedCalls , { nullable : true })
    docs?: PaginatedCalls;
}

@Resolver(Call)
export class CallResolver {

    @FieldResolver(() => Customer)
    customer( 
      @Root() call : Call,
    ){return Customer.findOne(call.customerId)}

    @FieldResolver(() => Package)
    package( 
      @Root() call : Call,
    ){return Package.findOne(call.packageId)}
    
    @Mutation(() => CallsResponse)
    // @UseMiddleware(isAuth,isCan("Call-show" , "Call"))
    async getCalls(
        @Arg('limit', () => Int, {nullable : true}) limit: number,
        @Arg('page', () => Int,{nullable : true}) page: number,
        @Arg('input') input: CallSearchInput,
    ) : Promise<CallsResponse>{
        const { status , issue , minorIssue , exactIssue , name , mobile , phone , callCode , year , month } = input;
        const currentPage = page || 1;
        const take = limit || 10;
        const skip = (currentPage - 1) * take;
        const tableName = "`call`";
        const query = `from ${tableName} as s 
        ${name || mobile || phone ? `left join customer as c on s.customerId = c.id` : ""}
        where s.status = ${status} 
        ${issue ? ` and s.issue LIKE '%${issue}%' `: ""}
        ${minorIssue ? `and s.minorIssue LIKE '%${minorIssue}%' ` : ""}
        ${exactIssue ? `and s.exactIssue LIKE '%${exactIssue}%' ` : ""}
        ${callCode ? `and s.callCode LIKE '%${callCode}%' ` : ""}
        ${year ? `and s.exactIssue LIKE '%${year}%' ` : ""}
        ${month ? `and s.exactIssue LIKE '%${month}%' ` : ""}
        ${mobile ? `and c.mobile LIKE '%${mobile}%' ` : ""}
        ${phone ? `and c.phone LIKE '%${phone}%' ` : ""}
        ${name ? `and c.name LIKE '%${name}%' ` : ""}
        `;
        const t = await getConnection().query(`select count(*) as 'count' ${query}`);
        const calls = await getConnection().query(`select s.* ${query} order by id desc limit ${skip},${take}`);
        const total = t[0].count;
        let pages = Math.floor((total % take > 0) ? (total / take) + 1 : (total / take)) as number


        return {status : true , docs : {calls , total , page : currentPage , pages}}
    }
    @Query(() => CallResponse)
    // @UseMiddleware(isAuth,isCan("Call-show" , "Call"))
    async getCall(
        @Arg('id' , () => Int) id : number
    ) : Promise<CallResponse>{
        let errors = await callValidator(null,id);
        if(errors?.length) return { status : false , errors};
        const call = await Call.findOne({id});

        return { status : true , call }
    }

    @Mutation(() => CallResponse)
    // @UseMiddleware(isAuth,isCan("Call-create" , "Call"))
    async createCall(
        @Arg('input') input: CallInput,
    ) : Promise<CallResponse>{
        let errors = await callValidator(input,null);
        if(errors?.length) return { status : false , errors};
        await Call.create({...input}).save();
        
        return { status: true };
    }

    @Mutation(() => CallResponse)
    // @UseMiddleware(isAuth,isCan("Call-update" , "Call"))
    async updateCall(
        @Arg('id' , () => Int) id: number,
        @Arg('input') input: CallInput,
    ) : Promise<CallResponse>{
        let errors = await callValidator(input,id);
        if(errors?.length) return { status : false , errors};
        await Call.update({id} , {...input});
        return { status: true };
    }

    @Mutation(() => CallResponse)
    // @UseMiddleware(isAuth,isCan("Call-delete" , "Call"))
    async activeOrDeactiveCall(
        @Arg('id' , () => Int) id: number,
        @Arg('status') status: boolean
    ) : Promise<CallResponse>{
        const errors = await callValidator(null,id);
        if(errors?.length) return { status : false , errors};
        await Call.update({id},{ status });
        return {status : true};
    }
}