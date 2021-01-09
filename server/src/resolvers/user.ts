import bcrypt from 'bcrypt';
import { Arg, Ctx, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware  } from 'type-graphql';
import { User } from '../entities/User';
import {MyContext} from '../types';
import {ChangePasswordInput, UserRegisterInput, UserSearchInput} from './Input';
import { createUserValidator  , changePasswordValidator} from '../validators/userValidator';
import { createAccessToken , createRefreshToken } from '../constants/auth';
import { getConnection } from 'typeorm';
import { Token } from '../entities/Token';
import sms from '../constants/sms';
import { FieldError } from './response';
import { Role } from '../entities/Role';
import { isAuth } from '../middlewares/isAuthMiddleware';
import {isCan} from '../middlewares/isCanMiddleware';
import {createLog} from '../constants/functions'


@ObjectType()
export class PaginatedUsers {
    @Field()
    total!: number;
    @Field()
    page!: number;
    @Field()
    pages!: number;
    @Field(() => [User],{ nullable : true })
    users?: User[];
}


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
    @Field(() => PaginatedUsers , {nullable : true})
    docs?: PaginatedUsers;
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
    @Query(() => [Role])
    @UseMiddleware(isAuth)
    async getRolesForCreateUser() : Promise<Role[]> {
        return await Role.find({where : {status : true}});
    }

    @Query(() => User , {nullable : true})
    @UseMiddleware(isAuth)
    async me(@Ctx() { payload } : MyContext){
        const user = await User.findOne({ where : {id : payload?.userId}})
        return user;
    }
    @Mutation(() => UsersResponse)
    @UseMiddleware(isAuth,isCan("show-user" , "User"))
    async getUsers(
        @Arg('limit', () => Int, {nullable : true}) limit: number,
        @Arg('page', () => Int,{nullable : true}) page: number,
        @Arg('input') input: UserSearchInput,
    ) : Promise<UsersResponse>{
        const { active , name , mobile , email , roleId } = input;
        const currentPage = page || 1;
        const take = limit || 10;
        const skip = (currentPage - 1) * take;
        const tableName = "`user`";
        const query = `from ${tableName} as s 
        where s.active = ${active ? active : "s.active"} 
        ${name ? ` and s.name LIKE '%${name}%' `: ""}
        ${mobile ? ` and s.mobile LIKE '%${mobile}%' `: ""}
        ${email ? ` and s.email LIKE '%${email}%' `: ""}
        ${roleId ? ` and s.roleId = ${roleId} `: ""}
        `;
        const t = await getConnection().query(`select count(*) as 'count' ${query}`);
        const users = await getConnection().query(`select s.* ${query} order by id desc limit ${skip},${take}`);
        const total = t[0].count;
        let pages = Math.floor((total % take > 0) ? (total / take) + 1 : (total / take)) as number
        return {status : true , docs : {users , total , page : currentPage , pages}}
    }
    @Mutation(() => UserResponse)
    @UseMiddleware(isAuth,isCan("status-user" , "User"))
    async activeOrDeactiveUser(
        @Arg('id' , () => Int) id: number,
        @Arg('active' ) active: boolean,
        @Ctx() {payload} : MyContext
    ) : Promise<UserResponse>{
        const errors = await createUserValidator(null, null, id)
        if(errors?.length) return { errors , status: false }
        const user = await User.update({id} , {active});
        await createLog(payload?.userId as number , 10 , "activeOrDeactive" , user , id);
        return { status : true }
    }
    @Query(() => UserResponse)
    @UseMiddleware(isAuth,isCan("show-user" , "User"))
    async getUser(
        @Arg('id' , () => Int) id : number
    ) : Promise<UserResponse>{
        const errors = await createUserValidator(null, null, id)
        if(errors?.length) return { errors , status: false }
        const user = await User.findOne({id})
        return { status : true , user }
    }

    @Mutation(() => UserResponse)
    async changePasswordRequest(
        @Arg('mobile') mobile : string
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
    @UseMiddleware(isAuth,isCan("create-user" , "User"))
    async createUser(
        @Arg('options') options: UserRegisterInput,
        @Arg('password' , {nullable : true}) password: string,
        @Ctx() {payload} : MyContext
    ) : Promise<UserResponse>{ 
        const errors = await createUserValidator(options, password)
        if(errors?.length) return { errors , status: false }
        password = await bcrypt.hash(password, 10);
        const user = await User.create({...options,password}).save();
        await createLog(payload?.userId as number , 10 , "create" , user , user.id);
        return {status: true};
    }
    @Mutation( () => UserResponse)
    @UseMiddleware(isAuth,isCan("update-user" , "User"))
    async updateUser(
        @Arg('options') options: UserRegisterInput,
        @Arg('id', () => Int) id : number,
        @Arg('password' , {nullable : true}) password: string,
        @Ctx() {payload} : MyContext
    ) : Promise<UserResponse>{ 
        const errors = await createUserValidator(options , password , id)
        if(errors?.length) return { errors , status: false }
        if(password) {
            password = await bcrypt.hash(password, 10);
            await User.update({id} , {...options , password});
        }else{
           await User.update({id} , {...options});
        }
        const user = await User.findOne({id});
        await createLog(payload?.userId as number , 10 , "edit" , user , id);
        return {status: true ,user};
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
        }else {
            const valid = await bcrypt.compare(password , user!.password);
            if(!valid){
                errors.push({
                    field: 'password',
                    message : 'رمز عبور اشتباه است'
                });
            }
            if(!user.active){
                errors.push({
                    field: 'active',
                    message : 'حساب کاربری شما غیرفعال شده است'
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
