import { Survey } from "../entities/Survey"
import { SurveyInput } from "../resolvers/Input"

export const surveyValidator = async (input: SurveyInput | null = null , id : number | null = null) => {
    let errors = [];
    if(id){
        const survey = await Survey.findOne({id});
        if (!survey) {
            errors.push({
                field: 'id',
                message: 'نظرسنجی مورد نظر یافت نشد'
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
    }
    return errors
}