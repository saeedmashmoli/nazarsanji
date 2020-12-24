import { Permission } from '../entities/Permission';
import { Arg, Ctx, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root  } from 'type-graphql';
import { FieldError } from './response';
import { PermissionInput, PermissionSearchInput } from './Input';
import { permissionValidator } from '../validators/permissionRoleValidator';
import { getConnection } from 'typeorm';
import { MyContext } from '../types';
import { Log } from '../entities/Log';
// import { isAuth } from '../middlewares/isAuthMiddleware';
// import {isCan} from '../middlewares/isCanMiddleware';
@ObjectType()
export class PaginatedPermissions {
    @Field()
    total: number;
    @Field()
    page!: number;
    @Field()
    pages!: number;
    @Field(() => [Permission] , { nullable : true })
    permissions?: Permission[];
}


@ObjectType()
class PermissionResponse {
    @Field(() => [FieldError] , {nullable : true})
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => Permission , {nullable : true})
    permission?: Permission;
}


@ObjectType()
class PermissionsResponse {
    @Field(() => [FieldError] , {nullable : true})
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => PaginatedPermissions)
    docs?: PaginatedPermissions;
}

@Resolver(Permission)
export class PermissionResolver {

    @FieldResolver(() => [Permission])
    async permissions( 
      @Root() permission : Permission,
    ){
        const roles = await getConnection().query(`
        select * from role as p 
        left join permission_role as pr 
        on p.id = pr.roleId
        where pr.permissionId = ${permission.id}
        `)
        return roles;
    }
    @Mutation(() => PermissionsResponse)
    // @UseMiddleware(isAuth,isCan("permission-show" , "Permission"))
    async getPermissions(
        @Arg('limit', () => Int, {nullable : true}) limit: number,
        @Arg('page', () => Int,{nullable : true}) page: number,
        @Arg('input', { nullable : true}) input: PermissionSearchInput
    ) : Promise<PermissionsResponse>{
        const { status , title , label , roleIds , permissionId  , model } = input;
        let currentPage = page || 1;
        let take = limit || 10;
        let skip = (currentPage - 1) * take;
        let query = `from permission as s 
        ${roleIds ? `left join permission_role as pr on pr.permissionId = s.id` : ""}
        where ${status ? `s.status = ${status}` : "s.status = s.status"}
        ${model ? `and s.title like '%${model}%' `: ""}
        ${permissionId ? `and s.roleId = ${permissionId}` : ""}
        ${title ? `and s.title like '%${title}%' `: ""}
        ${label ? `and s.label like '%${label}%' `: ""}
        `;
        const t = await getConnection().query(`select count(*) as 'count' ${query}`);
        const permissions = await getConnection().query(`select s.* ${query} order by id desc limit ${skip},${take}`);
        let pages = Math.floor((t[0].count % take > 0) ? (t[0].count / take) + 1 : (t[0].count / take)) as number
        return { status : true , docs : { permissions , total :t[0].count , page : currentPage , pages }}
    }
    @Query(() => PermissionResponse)
    // @UseMiddleware(isAuth,isCan("permission-show" , "Permission"))
    async getPermission(
        @Arg('id' , () => Int) id : number
    ) : Promise<PermissionResponse>{
        const errors = await permissionValidator(null,id);
        if(errors?.length) return {status : false , errors}
        const permission = await Permission.findOne({id})
        return { permission , status : true}
    }

    @Mutation(() => PermissionResponse)
    // @UseMiddleware(isAuth,isCan("permission-create" , "Permission"))
    async createPermission(
        @Arg('input') input: PermissionInput,
        @Ctx() {payload} : MyContext
    ) : Promise<PermissionResponse>{
        const errors = await permissionValidator(input,null);
        if(errors?.length) return {status : false , errors}
        const permission = await Permission.create({...input}).save();

        return {status :true};
    }

    @Mutation(() => PermissionResponse)
    // @UseMiddleware(isAuth,isCan("permission-update" , "Permission"))
    async updatePermission(
        @Arg('id' , () => Int) id: number,
        @Arg('input') input: PermissionInput,
        @Ctx() {payload} : MyContext
    ) : Promise<PermissionResponse>{
        const errors = await permissionValidator(input,id);
        if(errors?.length) return {status : false , errors}
        const permission = await Permission.update({id},{...input});

        return {status :true};
    }

    @Mutation(() => PermissionResponse)
    // @UseMiddleware(isAuth,isCan("permission-delete" , "Permission"))
    async activeOrDeactivePermission(
        @Arg('id' , () => Int) id: number,
        @Arg('status') status: boolean,
        @Ctx() {payload} : MyContext
    ) : Promise<PermissionResponse>{
        const errors = await permissionValidator(null,id);
        if(errors?.length) return {status : false , errors}
        const permission = await Permission.update({id},{ status});

        return { status : true };;
    }
}





// const data = {
//     userId : payload?.userId ,
//     modelId : 12 ,
//     operation : `activeOrDeactive : ${permission}`,
//     rowId : id
// } as any
// await Log.create({...data}).save();