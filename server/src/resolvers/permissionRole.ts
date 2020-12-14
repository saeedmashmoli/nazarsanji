import { Role } from '../entities/Role';
import { Permission } from '../entities/Permission';
import { Arg, Mutation, Query, Resolver  } from 'type-graphql';
// import { isAuth } from '../middlewares/isAuthMiddleware';
// import {isCan} from '../middlewares/isCanMiddleware';


@Resolver()
export class PermissionRoleResolver {
    
    @Query(() => [Role])
    // @UseMiddleware(isAuth,isCan("role-show" , "Role"))
    async getRoles(
    ) : Promise<Role[]>{
        const roles = await Role.find({where : {status : true}});
        console.log(roles)
        return roles
    }

    @Mutation(() => Boolean)
    // @UseMiddleware(isAuth,isCan("role-create" , "Role"))
    async createRole(
        @Arg('title') title: string,
        @Arg('label') label: string,
    ) : Promise<Boolean>{
        await Role.create({title,label}).save();
        return true;
    }

    @Mutation(() => Boolean)
    // @UseMiddleware(isAuth,isCan("role-update" , "Role"))
    async updateRole(
        @Arg('id') id: number,
        @Arg('title') title: string,
        @Arg('label') label: string,
    ) : Promise<Boolean>{
        await Role.update({id},{title,label});
        return true;
    }

    @Mutation(() => Boolean)
    // @UseMiddleware(isAuth,isCan("role-delete" , "Role"))
    async deleteRole(
        @Arg('id') id: number,
    ) : Promise<Boolean>{
        await Role.update({id},{ status : false });
        return true;
    }


    @Query(() => [Permission])
    // @UseMiddleware(isAuth,isCan("permission-show" , "Permission"))
    async getPermissions() : Promise<Permission[]>{
        return await Permission.find({where : {status : true}})
    }

    @Mutation(() => Boolean)
    // @UseMiddleware(isAuth,isCan("permission-create" , "Permission"))
    async createPermission(
        @Arg('title') title: string,
        @Arg('label') label: string,
        @Arg('model') model: string
    ) : Promise<Boolean>{
        await Permission.create({title,label , model}).save();
        return true;
    }

    @Mutation(() => Boolean)
    // @UseMiddleware(isAuth,isCan("permission-update" , "Permission"))
    async updatePermission(
        @Arg('id') id: number,
        @Arg('title') title: string,
        @Arg('label') label: string,
        @Arg('model') model: string
    ) : Promise<Boolean>{
        await Permission.update({id},{title,label , model});
        return true;
    }

    @Mutation(() => Boolean)
    // @UseMiddleware(isAuth,isCan("permission-delete" , "Permission"))
    async deletePermission(
        @Arg('id') id: number,
    ) : Promise<Boolean>{
        await Permission.update({id},{ status : false });
        return true;
    }

}