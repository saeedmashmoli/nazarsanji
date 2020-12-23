import { Template } from "../entities/Template"
import { TemplateInput } from "../resolvers/Input"

export const templateValidator = async (input: TemplateInput | null = null , id : number | null = null) => {
    let errors = [];
    if(id){
        const tempalte = await Template.findOne({id});
        if (!tempalte) {
            errors.push({
                field: 'id',
                message: 'قالب پیامکی مورد نظر یافت نشد'
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
        if(input.tempNumber === undefined ){
            errors.push({
                field: 'tempNumber',
                message : 'فیلد کد قالب پیامکی الزامی است'
            });
        }
    }
    return errors
}