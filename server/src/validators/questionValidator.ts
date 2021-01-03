import { Question } from "../entities/Question"
import { QuestionInput } from "../resolvers/Input"

export const questionValidator = async (input: QuestionInput | null = null , id : number | null = null) => {
    let errors = [];
    if(id) {
        const question = await Question.findOne({id});
        if (!question) {
            errors.push({
                field: 'id',
                message: 'سوال مورد نظر یافت نشد'
            });
        }
    }
    if(input){
        if(input.title?.trim() === "" || input.title === undefined){
            errors.push({
                field: 'title',
                message : 'فیلد عنوان الزامی است'
            });
        }
        if(input.turn === undefined ){
            errors.push({
                field: 'turn',
                message : 'فیلد نوبت نمایش الزامی است'
            });
        }
        if(input.typeId === undefined ){
            errors.push({
                field: 'typeId',
                message : 'فیلد نوع سوال الزامی است'
            });
        }
        if(input.surveyId === undefined ){
            errors.push({
                field: 'surveyId',
                message : 'فیلد نظرسنجی الزامی است'
            });
        }
    }
        
    return errors
}
