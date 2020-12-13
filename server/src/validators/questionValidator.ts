import { Question } from "../entities/Question"
import { QuestionInput } from "../resolvers/Input"

export const questionValidator = (input: QuestionInput) => {
    if(input.title.length === 0 ){
        return [{
            field: 'title',
            message : 'فیلد عنوان الزامی است'
        }]
    }
    if(input.typeId === null ){
        return [{
            field: 'typeId',
            message : 'فیلد نوع سوال الزامی است'
        }]
    }
    if(input.surveyId === null ){
        return [{
            field: 'surveyId',
            message : 'فیلد نظرسنجی الزامی است'
        }]
    }

    return null
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