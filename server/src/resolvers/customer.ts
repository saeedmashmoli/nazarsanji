import { Customer } from '../entities/Customer';
import { Arg, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root  } from 'type-graphql';
import {  FieldError } from './response';
// import { isAuth } from '../middlewares/isAuthMiddleware';
// import {isCan} from '../middlewares/isCanMiddleware';
import { CustomerInput } from './Input';
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
export class CustomersResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => [Customer] , { nullable : true })
    customers?: Customer[];
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
        @Arg('status') status: Boolean
    ) : Promise<CustomersResponse>{
        const customers = await getConnection().query(` 
            select s.* from customer as s 
            where ${status ? "status = true" : "status = status"}
            order by s.id desc
        `);
        return {status : true , customers}
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