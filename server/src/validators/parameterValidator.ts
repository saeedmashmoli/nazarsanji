import { Parameter } from "../entities/Parameter"
import { ParameterInput } from "../resolvers/Input"

export const parameterValidator = async (input: ParameterInput | null = null , id : number | null = null) => {
    let errors = [];
    if(id){
        const parameter = await Parameter.findOne({id});
        if (!parameter) {
            errors.push({
                field: 'id',
                message: 'پارامتر مورد نظر یافت نشد'
            });
        }
    }
    if(input){
        if(input.title.length === 0 ){
            errors.push({
                field: 'title',
                message : 'فیلد عنوان الزامی است'
            });
        }
        if(input.label.length === 0 ){
            errors.push({
                field: 'label',
                message : 'فیلد شرح الزامی است'
            });
        }
    }
    return errors
}