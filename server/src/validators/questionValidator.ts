import { Question } from "../entities/Question"
import { QuestionInput } from "../resolvers/Input"

export const questionValidator = (input: QuestionInput) => {
    let errors = [];
    if(input.title.length === 0 ){
        errors.push({
            field: 'title',
            message : 'فیلد عنوان الزامی است'
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

    return errors
}
export const updateOrDeleteQuestionValidator = async (id: number) => {
    const question = await Question.findOne({id});
    if (!question) {
        return [{
            field: 'id',
            message: 'سوال مورد نظر یافت نشد'
        }];
    }
    return null
}