import { Answer } from "../entities/Answer"
import { AnswerInput } from "../resolvers/Input"

export const answerValidator = (input: AnswerInput) => {
    if(input.questionId === undefined ){
        return [{
            field: 'questionId',
            message : 'فیلد سوال الزامی است'
        }]
    }

    return null
}
export const updateOrDeleteAnswerValidator = async (id: number) => {
    const answer = await Answer.findOne({id});
    if (!answer) {
        return [{
            field: 'id',
            message: 'پاسخ مورد نظر یافت نشد'
        }];
    }
    return null
}