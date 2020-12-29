import { Condition } from "../entities/Condition"
import { ConditionInput } from "../resolvers/Input"

export const conditionValidator = async (input: ConditionInput | null = null , id : number | null = null) => {
    let errors = [];
    if(id){
        const condition = await Condition.findOne({id});
        if (!condition) {
            errors.push({
                field: 'id',
                message: 'شرط مورد نظر یافت نشد'
            });
        }
    }
    if(input){
        if(input.questionId === undefined){
            errors.push({
                field: 'questionId',
                message : 'فیلد سوال الزامی است'
            });
        }
        if(input.consQuestionId === undefined){
            errors.push({
                field: 'consQuestionId',
                message : 'فیلد سوال مد نظر الزامی است'
            });
        }
        if(input.answerId === undefined){
            errors.push({
                field: 'answerId',
                message : 'فیلد گزینه الزامی است'
            });
        }
        if(input.criteriaId === undefined){
            errors.push({
                field: 'criteriaId',
                message : 'فیلد شرط الزامی است'
            });
        }
    }
    
    return errors
}