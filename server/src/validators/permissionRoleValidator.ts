import { Role } from "../entities/Role";
import { Permission } from "../entities/Permission";
import { PermissionInput, RoleInput } from "../resolvers/Input"


export const roleValidator = async(input: RoleInput | null , id : number | null) => {
    let errors = [];
    if(id){
        const role = await Role.findOne({id})
        if(!role){
            errors.push({ 
                message : "نقش مورد نظر یافت نشد" , 
                field : "id" 
            });
        }
    }
    if(input){
        if(input.title.trim() == "" ){
            errors.push({
                field: 'title',
                message : 'فیلد عنوان الزامی است'
            })
        }
        if(input.label.trim() == "" ){
            errors.push({
                field: 'label',
                message : 'فیلد شرح الزامی است'
            })
        }
    }
    return errors
}

export const permissionValidator = async (input: PermissionInput | null , id : number | null) => {
    let errors = [];
    if(id){
        const permission = await Permission.findOne({id})
        if(!permission){
            errors.push({ 
                message : "دسترسی مورد نظر یافت نشد" , 
                field : "id" 
            });
        }
    }
    if(input){
        if(input.title.trim() == "" ){
            errors.push({
                field: 'title',
                message : 'فیلد عنوان الزامی است'
            })
        }
        if(input.label.trim() == "" ){
            errors.push({
                field: 'label',
                message : 'فیلد شرح الزامی است'
            })
        }
        if(input.model.trim() == "" ){
            errors.push({
                field: 'model',
                message : 'فیلد بخش الزامی است'
            })
        }
    }
    return errors;

}