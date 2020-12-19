import bcrypt from 'bcrypt';
import { Arg, Ctx, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware  } from 'type-graphql';
import { User } from '../entities/User';
import {MyContext} from '../types';
import {ChangePasswordInput, UserRegisterInput} from './Input';
import { createUserValidator  , changePasswordValidator} from '../validators/userValidator';
import { createAccessToken , createRefreshToken } from '../constants/auth';
import { isAuth } from '../middlewares/isAuthMiddleware';
import { getConnection } from 'typeorm';
import { Token } from '../entities/Token';
import sms from '../constants/sms';
import { FieldError } from './response';
import { Role } from '../entities/Role';



@ObjectType()
class UserResponse {
    @Field(() => [FieldError] , {nullable : true})
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => User , {nullable : true})
    user?: User;
}
@ObjectType()
class UsersResponse {
    @Field(() => [FieldError] , {nullable : true})
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => [User] , {nullable : true})
    users?: User[];
}


@Resolver(User)
export class UserResolver {

    @FieldResolver(() => User)
    role( 
      @Root() user : User,
    ){return Role.findOne(user.roleId)}

    @Mutation(() => Boolean)
    async revokeTokenVersionForUser(
        @Arg('userId', () => Int) userId : number
    ){
        await getConnection().getRepository(User).increment({ id : userId } , "tokenVersion" , 1);
        return true;
    }

    @Query(() => User , {nullable : true})
    @UseMiddleware(isAuth)
    async me(@Ctx() { payload } : MyContext){
        const user = await User.findOne({ where : {id : payload?.userId}})
        return user;
    }
    @Mutation(() => UsersResponse)
    async getUsers() : Promise<UsersResponse>{
        const users = await User.find({});
        return { status : true , users }
    }
    @Mutation(() => UserResponse)
    async activeOrDeactiveUser(
        @Arg('id' , () => Int) id: number
    ) : Promise<UserResponse>{
        const user = await User.findOne({id});
        await User.update({id} , {active : !user?.active});
        return { status : true }
    }
    @Query(() => UserResponse)
    async getUser(
        @Arg('id' , () => Int) id : number
    ) : Promise<UserResponse>{
        const user = await User.findOne({id})
        if(!user){
            return {status : false , errors :  [{message : "کاربر مورد نظر یافت نشد"  , field : "id" }]}
        }
        return { status : true , user }
    }

    @Mutation(() => UserResponse)
    async changePasswordRequest(
        @Arg('mobile') mobile:string
    ) : Promise<UserResponse>{
        const user = await User.findOne({where : {mobile}});
        if(!user){
            return {
                status : false,
                errors: [{
                    field: 'mobile',
                    message : 'موبایل وارد شده قبلا ثبت نام نکرده است'
                }],
            }
        }
        const code = Math.floor(100000 + Math.random() * 900000);
        const token = await Token.create({ code , creatorId : user.id}).save()
        user.tokenId = token.id
        user.save()
        sms.sendVerificationCode(user.mobile,code.toString())
        return { status : true }
    }

    @Mutation( () => UserResponse)
    async changePassword(
        @Arg('input' ) input: ChangePasswordInput,
        @Ctx() { res } : MyContext
    ) : Promise<UserResponse>{
        const { mobile , newPassword  } = input
        const user = await User.findOne({mobile});
        //validate data
        const errors = await changePasswordValidator(input, user!)
        if(errors) return { errors , status: false }
        // hash & update password
        let password = await bcrypt.hash(newPassword, 10);
        await User.update({ mobile } , { password });
        
        res.cookie("access-token",{token : await createAccessToken(user!)} , { httpOnly : true });
        res.cookie("refresh-token",{token : await createRefreshToken(user!)} , { httpOnly : true });
        return { status : true, user };
    }

    @Mutation( () => UserResponse)
    async createUser(
        @Arg('options') options: UserRegisterInput,
        @Arg('password' , {nullable : true}) password: string
    ) : Promise<UserResponse>{ 
        
        const errors = await createUserValidator(options, password , true)
        if(errors.length !== 0) return { errors , status: false }
        const userExsists = await User.findOne({ mobile : options.mobile });
        if(userExsists){
            return { 
                status: false,
                errors : [{
                    field: 'mobile',
                    message : 'موبایل وارد شده قبلا ثبت نام کرده است'
                }],
            }
        }
        password = await bcrypt.hash(password, 10);
        await User.create({...options,password}).save();
        return {status: true};
    }
    @Mutation( () => UserResponse)
    async updateUser(
        @Arg('options') options: UserRegisterInput,
        @Arg('id', () => Int) id : number,
        @Arg('password' , {nullable : true}) password: string
    ) : Promise<UserResponse>{ 
        const errors = await createUserValidator(options , password , false)
        if(errors.length !== 0) return { errors , status: false }
        const user = await User.findOne({ id });
        if(!user){
            return { 
                status: false,
                errors : [{
                    field: 'id',
                    message : 'کاربر مورد نظر یافت نشد'
                }],
            }
        }
        if(password) {
            password = await bcrypt.hash(password, 10);
            await User.update({id} , {...options , password});
        }else{
            await User.update({id} , {...options});
        }
        return {status: true};
    }
    @Mutation( () => UserResponse)
    async login(
        @Arg('username') username:string,
        @Arg('password') password: string,
        @Ctx() { res } : MyContext
    ) : Promise<UserResponse>{ 
        const user = await User.findOne({ where : {mobile : username }});
        let errors = [];
        if(!user) {
            errors.push({
                field: 'username',
                message : 'موبایل وارد شده در سامانه ثبت نام نکرده است'
            });
        }else{
            const valid = await bcrypt.compare(password , user!.password);
            if(!valid){
                errors.push({
                    field: 'password',
                    message : 'رمز عبور اشتباه است'
                });
            }
        }
        if(errors.length !== 0){
            return { status : false , errors }
        }

        res.cookie("access-token",{token : await createAccessToken(user!)} , { httpOnly : true });
        res.cookie("refresh-token",{token : await createRefreshToken(user!)} , { httpOnly : true });
        return {user ,status: true};
        
    }

    @Query(() => Boolean)
    async logout(
        @Ctx() { res} : MyContext
    ) : Promise<Boolean>{

        res.clearCookie("access-token")
        res.clearCookie("refresh-token")
        return true;
    }
}