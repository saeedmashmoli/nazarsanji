import { User } from "../entities/User";
import { MyContext } from "../types";
import { MiddlewareFn } from "type-graphql";


export function isCan(title: string , model: string): MiddlewareFn<MyContext> {
  return async ({context}, next) => {
    const user = await User.findOne({where : { id : context.payload?.userId } , relations: ["role" , 'role.permissions']});
    let result = false;
    await user?.role.permissions.map(permit => {
      if(permit.model == model && permit.title == title){
        result = true;
      }
    })
    if(result){
      return next();
    }
      throw new Error('عدم دسترسی') 
  }  
};
  