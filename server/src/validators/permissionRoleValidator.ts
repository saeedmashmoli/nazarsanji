import { PermissionInput, RoleInput } from "../resolvers/Input"


export const roleValidator = (input: RoleInput) => {

    let errors = [];
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
    if(errors.length){
        return errors;
    }else{
        return null
    }
}

export const permissionValidator = (input: PermissionInput) => {
    let errors = [];
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
    if(errors.length !== 0){
        return errors;
    }else{
        return null
    }
}