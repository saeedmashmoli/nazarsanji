import { Answer } from "../entities/Answer"
import { AnswerInput } from "../resolvers/Input"

export const answerValidator = async (input: AnswerInput | null , id : number | null) => {
    let errors = []
    if(input){
        if(input.questionId === undefined ){
            errors.push({
                field: 'questionId',
                message : 'فیلد سوال الزامی است'
            })
        }
    }
    if(id){
        const answer = await Answer.findOne({id});
        if (!answer) {
            return [{
                field: 'id',
                message: 'پاسخ مورد نظر یافت نشد'
            }];
        }
    }

    return errors
}
