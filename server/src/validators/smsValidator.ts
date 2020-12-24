import { SmsInput } from "../resolvers/Input";
import { Sms } from "../entities/Sms";

export const smsValidator = async (input: SmsInput | null , id: number | null ) => {
    let errors = [];
    if(id){
        const send = await Sms.findOne({id});
        if (!send) {
            errors.push({
                field: 'id',
                message: 'پیامک مورد نظر یافت نشد'
            });
        }
    }
    if(input){
        if(input.surveyId === undefined ){
            errors.push({
                field: 'surveyId',
                message : 'فیلد نظرسنجی الزامی است'
            })
        }
        
        if(input.templateId === undefined ){
            errors.push({
                field: 'templateId',
                message : 'فیلد قالب الزامی است'
            })
        }
        if(input.packageId === undefined ){
            errors.push({
                field: 'packageId',
                message : 'فیلد بسته الزامی است'
            })
        }
    }


  
    return errors
}