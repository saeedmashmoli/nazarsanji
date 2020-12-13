import { Survey } from "../entities/Survey"
import { SurveyInput } from "../resolvers/Input"

export const surveyValidator = (input: SurveyInput) => {
    if(input.title.length === 0 ){
        return [{
            field: 'title',
            message : 'فیلد عنوان الزامی است'
        }]
    }
    return null
}
export const updateOrDeleteSurveyValidator = async (id: number) => {
    const survey = await Survey.findOne({id});
    if (!survey) {
        return [{
            field: 'id',
            message: 'نظرسنجی مورد نظر یافت نشد'
        }];
    }
    return null
}