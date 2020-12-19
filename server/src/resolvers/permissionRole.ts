import { Role } from '../entities/Role';
import { Permission } from '../entities/Permission';
import { Arg, Field, Int, Mutation, ObjectType, Query, Resolver  } from 'type-graphql';
import { FieldError } from './response';
import { PermissionInput, RoleInput } from './Input';
import { permissionValidator, roleValidator } from '../validators/permissionRoleValidator';
import { PermissionRole } from '../entities/PermissionRole';
import { getConnection } from 'typeorm';
// import { isAuth } from '../middlewares/isAuthMiddleware';
// import {isCan} from '../middlewares/isCanMiddleware';

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
class PermissionResponse {
    @Field(() => [FieldError] , {nullable : true})
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => Permission , {nullable : true})
    permission?: Permission;
}
// @ObjectType()
// class PaginatedRoles {
//     @Field(() => [Role])
//     roles!: Role[];
//     @Field()
//     total!: number;
//     @Field()
//     page!: number;
//     @Field()
//     pages!: number;
// }
@ObjectType()
class RolesResponse {
    @Field(() => [FieldError] , {nullable : true})
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => [Role])
    roles?: Role[];
}
@ObjectType()
class PermissionsResponse {
    @Field(() => [FieldError] , {nullable : true})
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => [Permission] , {nullable : true})
    permissions?: Permission[];
}

@Resolver()
export class PermissionRoleResolver {
    protected async addPermitToRole(roleId: number , permissionId : number) {
        await PermissionRole.create({roleId , permissionId}).save();
    }
    protected async deletePermitFromRole(roleId: number , permissionId : number) {
        await PermissionRole.delete({roleId , permissionId});
    }
    
    @Mutation(() => RolesResponse)
    // @UseMiddleware(isAuth,isCan("role-show" , "Role"))
    async getRoles(
        @Arg('status') status: Boolean
    ) : Promise<RolesResponse>{
        const roles = await getConnection().query(` 
            select r.* from role as r 
            where ${status ? "status = true" : "status = status"}
        `);
        return { status : true , roles }
    }
    @Query(() => RoleResponse)
    // @UseMiddleware(isAuth,isCan("role-show" , "Role"))
    async getRole(
        @Arg('id') id : number
    ) : Promise<RoleResponse>{
        const role = await Role.findOne({ where : {id}});
        if(!role){
            return { status : false , errors : [
                {
                    field : 'id',
                    message : 'نقش مورد نظر یافت نشد'
                }
            ]}
        }

        return { status : true , role }
    }

    @Mutation(() => RoleResponse)
    // @UseMiddleware(isAuth,isCan("role-create" , "Role"))
    async createRole(
        @Arg('input') input: RoleInput,
    ) : Promise<RoleResponse>{
        // is validate
        const errors = await roleValidator(input);
        if(errors) return {status : false , errors}
        //create role
        const role = await Role.create({...input}).save();
        //sync permissions to role
        await input.permissions?.forEach(p => {
            this.addPermitToRole(role.id,parseInt(p))
        })

        return {status : true };
    }

    @Mutation(() => RoleResponse)
    // @UseMiddleware(isAuth,isCan("role-update" , "Role"))
    async updateRole(
        @Arg('id') id: number,
        @Arg('input') input: RoleInput,
    ) : Promise<RoleResponse>{
        const {title , label , status , permissions} = input;
        // is validate
        const errors = await roleValidator(input);
        if(errors) return {status : false , errors}
        //update role
        await Role.update({id},{title,label,status});

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
    // @UseMiddleware(isAuth,isCan("role-delete" , "Role"))
    async deleteRole(
        @Arg('id') id: number,
    ) : Promise<RoleResponse>{
        const role = await Role.findOne({id});

        await Role.update({id},{ status : !role?.status });
        return { status : true };;
    }
    @Mutation(() => PermissionsResponse)
    // @UseMiddleware(isAuth,isCan("permission-show" , "Permission"))
    async getPermissions(
        @Arg('status') status : boolean
    ) : Promise<PermissionsResponse>{
        let permissions = [];
        if(status == true){
            permissions = await Permission.find({where : {status} , order : {id : 'DESC'}})
        }else{
            permissions = await Permission.find({order : {id : 'DESC'}})
        }
        return { permissions , status : true}
    }
    @Query(() => PermissionResponse)
    // @UseMiddleware(isAuth,isCan("permission-show" , "Permission"))
    async getPermission(
        @Arg('id' , () => Int) id : number
    ) : Promise<PermissionResponse>{
        const permission = await Permission.findOne({id})
        if(!permission){
            return { status : false , errors : [{ message : "شناسه مورد نظر درست نیست" , field : "id" }]}
        }
        return { permission , status : true}
    }

    @Mutation(() => PermissionResponse)
    // @UseMiddleware(isAuth,isCan("permission-create" , "Permission"))
    async createPermission(
        @Arg('input') input: PermissionInput,
    ) : Promise<PermissionResponse>{
        const errors = await permissionValidator(input);
        if(errors) return {status : false , errors}
        const permission = await Permission.create({...input}).save();
        return {status :true , permission};
    }

    @Mutation(() => PermissionResponse)
    // @UseMiddleware(isAuth,isCan("permission-update" , "Permission"))
    async updatePermission(
        @Arg('id' , () => Int) id: number,
        @Arg('input') input: PermissionInput,
    ) : Promise<PermissionResponse>{
        const errors = await permissionValidator(input);
        if(errors) return {status : false , errors}
        await Permission.update({id},{...input});
        const permission = await Permission.findOne({id})
        return {status :true , permission};
    }

    @Mutation(() => PermissionResponse)
    // @UseMiddleware(isAuth,isCan("permission-delete" , "Permission"))
    async deletePermission(
        @Arg('id') id: number,
    ) : Promise<PermissionResponse>{
        const permission = await Permission.findOne({id});

        await Permission.update({id},{ status : !permission?.status });
        return { status : true };;
    }
}