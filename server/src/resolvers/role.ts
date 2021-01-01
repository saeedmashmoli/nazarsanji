import { Role } from '../entities/Role';
import { Permission } from '../entities/Permission';
import { Arg, Ctx, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware  } from 'type-graphql';
import { FieldError } from './response';
import { RoleInput, RoleSearchInput } from './Input';
import { roleValidator } from '../validators/permissionRoleValidator';
import { PermissionRole } from '../entities/PermissionRole';
import { getConnection } from 'typeorm';
import { MyContext } from '../types';
import { isAuth } from '../middlewares/isAuthMiddleware';
import {isCan} from '../middlewares/isCanMiddleware';
import {createLog} from '../constants/functions'

@ObjectType()
export class PaginatedRoles {
    @Field()
    total: number;
    @Field()
    page!: number;
    @Field()
    pages!: number;
    @Field(() => [Role] , { nullable : true })
    roles?: Role[];
}

@ObjectType()
class RoleResponse {
    @Field(() => [FieldError] , {nullable : true})
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => Role , {nullable : true})
    role?: Role;
}

@ObjectType()
class RolesResponse {
    @Field(() => [FieldError] , {nullable : true})
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => PaginatedRoles)
    docs?: PaginatedRoles;
}

@Resolver(Role)
export class RoleResolver {
    protected async addPermitToRole(roleId: number , permissionId : number) {
        await PermissionRole.create({roleId , permissionId}).save();
    }
    protected async deletePermitFromRole(roleId: number , permissionId : number) {
        await PermissionRole.delete({roleId , permissionId});
    }
    @FieldResolver(() => [Permission])
    async permissions( 
      @Root() role : Role,
    ){
        const permissions = await getConnection().query(`
        select * from permission as p 
        left join permission_role as pr 
        on p.id = pr.permissionId
        where pr.roleId = ${role.id}
        `)
        return permissions;
    }

    @Query(() => [Permission])
    async getPermissionsForCreateRole() : Promise<Permission[]> {
        return await Permission.find({where : {status : true}});
    }

    
    @Mutation(() => RolesResponse)
    @UseMiddleware(isAuth,isCan("show-role" , "Role"))
    async getRoles(
        @Arg('limit', () => Int, {nullable : true}) limit: number,
        @Arg('page', () => Int,{nullable : true}) page: number,
        @Arg('input', { nullable : true}) input: RoleSearchInput
    ) : Promise<RolesResponse>{
        const { status , title , label , permissionIds , roleId } = input;
        let currentPage = page || 1;
        let take = limit || 10;
        let skip = (currentPage - 1) * take;
        let query = `from role as s 
        ${permissionIds ? `left join permission_role as pr on pr.roleId = s.id` : ""}
        where ${status ? `s.status = ${status}` : "s.status = s.status"}
        ${roleId ? `and s.roleId = ${roleId}` : ""}
        ${title ? `and s.title like '%${title}%' `: ""}
        ${label ? `and s.label like '%${label}%' `: ""}
        `;
        const t = await getConnection().query(`select count(*) as 'count' ${query}`);
        const roles = await getConnection().query(`select s.* ${query} order by id desc limit ${skip},${take}`);
        let pages = Math.floor((t[0].count % take > 0) ? (t[0].count / take) + 1 : (t[0].count / take)) as number
        return { status : true , docs : { roles , total :t[0].count , page : currentPage , pages }}
    }
    @Query(() => RoleResponse)
    @UseMiddleware(isAuth,isCan("show-role" , "Role"))
    async getRole(
        @Arg('id' , () => Int) id : number
    ) : Promise<RoleResponse>{
        const errors = await roleValidator(null , id);
        if(errors?.length) return {status : false , errors}
        const role = await Role.findOne({ where : {id}});

        return { status : true , role }
    }


    @Mutation(() => RoleResponse)
    @UseMiddleware(isAuth,isCan("create-role" , "Role"))
    async createRole(
        @Arg('input') input: RoleInput,
        @Ctx() {payload} : MyContext
    ) : Promise<RoleResponse>{
        // is validate
        const errors = await roleValidator(input , null);
        if(errors?.length) return {status : false , errors}
        //create role
        const role = await Role.create({...input}).save();

        //sync permissions to role
        await input.permissions?.forEach(p => {
            this.addPermitToRole(role.id,parseInt(p))
        })
        await createLog(payload?.userId as number , 11 , "create" , role , role.id);
        return {status : true};
    }

    @Mutation(() => RoleResponse)
    @UseMiddleware(isAuth,isCan("update-role" , "Role"))
    async updateRole(
        @Arg('id' , () => Int) id: number,
        @Arg('input') input: RoleInput,
        @Ctx() {payload} : MyContext
    ) : Promise<RoleResponse>{
        const {title , label , status , permissions} = input;
        // is validate
        const errors = await roleValidator(input,id);
        if(errors?.length) return {status : false , errors}
        //update role
        await Role.update({id},{title,label,status});
        const role = await Role.findOne({id})
        await createLog(payload?.userId as number , 11 , "edit" , role , id);

        //unsync permissions from role
        const oldPermissions = await PermissionRole.find({roleId : id});
        if(oldPermissions){
            await oldPermissions.forEach( permit => {
                if(!input.permissions?.includes(permit.permissionId.toString())){
                    this.deletePermitFromRole(id,permit.permissionId)
                }
            })
        }
        //sync permissions to role
        await permissions?.forEach(p => {
            this.addPermitToRole(id,parseInt(p))
        })
        return { status : true };
    }

    @Mutation(() => RoleResponse)
    @UseMiddleware(isAuth,isCan("status-role" , "Role"))
    async activeOrDeactiveRole(
        @Arg('id' , () => Int) id: number,
        @Arg('status') status: boolean,
        @Ctx() {payload} : MyContext
    ) : Promise<RoleResponse>{
        const errors = await roleValidator(null,id);
        if(errors?.length) return {status : false , errors}
        await Role.update({id},{status});
        const role = await Role.findOne({id})
        await createLog(payload?.userId as number , 11 , "activeOrDeactive" , role , id);
        return { status : true };;
    } 
}
