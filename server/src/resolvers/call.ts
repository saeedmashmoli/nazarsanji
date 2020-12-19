import { Call } from '../entities/Call';
import { Arg, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root  } from 'type-graphql';
import {  FieldError } from './response';
// import { isAuth } from '../middlewares/isAuthMiddleware';
// import {isCan} from '../middlewares/isCanMiddleware';
import { CallInput } from './Input';
import { updateOrDeleteCallValidator  , callValidator} from '../validators/callValidator';
import { Customer } from '../entities/Customer';
import { Package } from '../entities/Package';


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
    @Field(() => [Call] , { nullable : true })
    calls?: Call[];
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
        @Arg('status') status: Boolean
    ) : Promise<CallsResponse>{
        let calls = [];
        if(status) {
            calls = await Call.find({where : {status} , order : {id : 'DESC'}})
        }else {
            calls = await Call.find({order : {id : 'DESC'}})
        }

        return {status : true , calls}
    }
    @Query(() => CallResponse)
    // @UseMiddleware(isAuth,isCan("Call-show" , "Call"))
    async getCall(
        @Arg('id' , () => Int) id : number
    ) : Promise<CallResponse>{
        let errors = await updateOrDeleteCallValidator(id);
        if(errors?.length) return { status : false , errors};
        const call = await Call.findOne({id});

        return { status : true , call }
    }

    @Mutation(() => CallResponse)
    // @UseMiddleware(isAuth,isCan("Call-create" , "Call"))
    async createCall(
        @Arg('input') input: CallInput,
    ) : Promise<CallResponse>{
        let errors = await callValidator(input);
        if(errors?.length) return { status : false , errors};
        const call = await Call.create({...input}).save();
        
        return { status: true , call };
    }

    @Mutation(() => CallResponse)
    // @UseMiddleware(isAuth,isCan("Call-update" , "Call"))
    async updateCall(
        @Arg('id' , () => Int) id: number,
        @Arg('input') input: CallInput,
    ) : Promise<CallResponse>{
        console.log(input)
        let errors = await callValidator(input);
        if(errors.length) return { status : false , errors};
        let e = await updateOrDeleteCallValidator(id);
        if(e?.length) return { status : false , errors : e};
        await Call.update({id} , {...input});
        const call = await Call.findOne({id});
        return { status: true , call };
    }

    @Mutation(() => CallResponse)
    // @UseMiddleware(isAuth,isCan("Call-delete" , "Call"))
    async activeOrDeactiveCall(
        @Arg('id' , () => Int) id: number,
    ) : Promise<CallResponse>{
        const errors = await updateOrDeleteCallValidator(id);
        if(errors?.length) return { status : false , errors};
        const call = await Call.findOne({id});
        await Call.update({id},{ status : !call?.status });
        return {status : true};
    }
}