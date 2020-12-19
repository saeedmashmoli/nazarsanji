import { CallInput } from "src/resolvers/Input";
import { Call } from "../entities/Call";

export const callValidator = (input: CallInput) => {
    let errors = []
    if(input.customerId === undefined ){
        errors.push({
            field: 'customerId',
            message : 'فیلد مشتری الزامی است'
        })
    }
    if(input.packageId === undefined ){
        errors.push({
            field: 'packageId',
            message : 'فیلد بسته الزامی است'
        })
    }
    return errors
}


export const updateOrDeleteCallValidator = async (id: number) => {
    const call = await Call.findOne({id});
    if (!call) {
        return [{
            field: 'id',
            message: 'اطلاعات مورد نظر یافت نشد'
        }];
    }
    return null
}