
import { MyContext } from "../types";
import { MiddlewareFn } from "type-graphql";
import { getConnection } from "typeorm";
import { Permission } from "../entities/Permission";


export function isCan(title: string , model: string): MiddlewareFn<MyContext> {
  return async ({context}, next) => {
    const permissions = await getConnection().query(`
    select p.* from permission as p
    left join permission_role as pr on p.id = pr.permissionId
    left join user as u on pr.roleId = u.roleId
    where u.id = ${context.payload?.userId}
    `);
    let result = false;
    await permissions.forEach((permit: Permission) => {
      if(permit.model === model && permit.title === title){
        result = true
      }
    })
    if(await result){
      return next();
    }else{
        throw new Error('عدم دسترسی') 
    }

  }  
};
  