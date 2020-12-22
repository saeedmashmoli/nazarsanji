import { Customer } from '../entities/Customer';
import { Arg, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root  } from 'type-graphql';
import {  FieldError } from './response';
// import { isAuth } from '../middlewares/isAuthMiddleware';
// import {isCan} from '../middlewares/isCanMiddleware';
import { CustomerInput, CustomerSearchInput } from './Input';
import { customerValidator } from '../validators/customerValidator';
import { getConnection } from 'typeorm';
import { Call } from '../entities/Call';

@ObjectType()
export class CustomerResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => Customer , { nullable : true })
    customer?: Customer;
}

@ObjectType()
export class PaginatedCustomers {
    @Field()
    total: number;
    @Field()
    page!: number;
    @Field()
    pages!: number;
    @Field(() => [Customer] , { nullable : true })
    customers?: Customer[];
}
@ObjectType()
export class CustomersResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => PaginatedCustomers , { nullable : true })
    docs?: PaginatedCustomers;
}

@Resolver(Customer)
export class CustomerResolver {

    @FieldResolver(() => [Call])
    calls( 
      @Root() customer : Customer,
    ){return Call.find({where : {customerId :customer.id}})}
    
    @Mutation(() => CustomersResponse)
    // @UseMiddleware(isAuth,isCan("customer-show" , "customer"))
    async getCustomers(
        @Arg('limit', () => Int, {nullable : true}) limit: number,
        @Arg('page', () => Int,{nullable : true}) page: number,
        @Arg('input', {nullable : true}) input: CustomerSearchInput
    ) : Promise<CustomersResponse>{
        const { status , name , mobile , phone , customerId } = input;
        let currentPage = page || 1;
        let take = limit || 10;
        let skip = (currentPage - 1) * take;
        let query = `from customer as s 
        where ${status ? `status = ${status}` : "status = status"}
        ${name ? `and name like '%${name}%' `: ""}
        ${customerId ? `and id = ${customerId}' `: ""}
        ${mobile ? `and mobile like '%${mobile}%' ` : ""}
        ${phone ? `and phone like '%${phone}%' ` : ""}` ;
        const t = await getConnection().query(`select count(*) as 'count' ${query}`);
        const customers = await getConnection().query(`select s.* ${query} order by id desc limit ${skip},${take}`);
        let pages = Math.floor((t[0].count % take > 0) ? (t[0].count / take) + 1 : (t[0].count / take)) as number
        return {status : true , docs : {customers , total :t[0].count , page : currentPage , pages }}
    }
    @Query(() => CustomerResponse)
    // @UseMiddleware(isAuth,isCan("customer-show" , "customer"))
    async getCustomer(
        @Arg('id' , () => Int) id : number
    ) : Promise<CustomerResponse>{
        const errors = await customerValidator(null,id);
        if(errors?.length) return { status : false , errors};
        const customer = await Customer.findOne({id});
        return { status : true , customer }
    }

    @Mutation(() => CustomerResponse)
    // @UseMiddleware(isAuth,isCan("Customer-create" , "Customer"))
    async createCustomer(
        @Arg('input') input: CustomerInput,
    ) : Promise<CustomerResponse>{
        const errors = await customerValidator(input,null);
        if(errors?.length) return { status : false , errors};
        await Customer.create({...input}).save();
        return { status: true };
    }

    @Mutation(() => CustomerResponse)
    // @UseMiddleware(isAuth,isCan("Customer-update" , "Customer"))
    async updateCustomer(
        @Arg('id' , () => Int ) id: number,
        @Arg('input') input: CustomerInput,
    ) : Promise<CustomerResponse>{
        const errors = await customerValidator(input,id);
        if(errors?.length) return { status : false , errors};
        await Customer.update({id} , {...input});
        await Customer.findOne({id});
        return { status: true };
    }

    @Mutation(() => CustomerResponse)
    // @UseMiddleware(isAuth,isCan("Customer-delete" , "Customer"))
    async activeOrDeactiveCustomer(
        @Arg('id' , () => Int) id: number,
        @Arg('status') status: boolean
    ) : Promise<CustomerResponse>{
        const errors = await customerValidator(null,id);
        if(errors?.length) return { status : false , errors};
        await Customer.update({id},{status});
        return {status : true};
    }
}