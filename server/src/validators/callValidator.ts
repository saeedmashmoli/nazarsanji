import { CallInput } from "../resolvers/Input";
import { Call } from "../entities/Call";

export const callValidator = async (input: CallInput | null , id: number | null ) => {
    let errors = [];
    if(id){
        const call = await Call.findOne({id});
        if (!call) {
            errors.push({
                field: 'id',
                message: 'اطلاعات مورد نظر یافت نشد'
            });
        }
    }
    if(input){
        if(input.customerId === undefined ){
            errors.push({
                field: 'customerId',
                message : 'فیلد مشتری الزامی است'
            })
        }
    }


  
    return errors
}
