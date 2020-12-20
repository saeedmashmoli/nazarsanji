import { CustomerInput } from "../resolvers/Input"
import { Customer } from "../entities/Customer"

export const customerValidator = async (input: CustomerInput | null , id: number | null) => {
    console.log(input)
    let errors = [];
    if(input){
         if(input.mobile !== "" && input.mobile!.length !== 11){
            errors.push({
                field: 'mobile',
                message : 'موبایل وارد شده اشتباه است'
            });
        }
    }
    if(id){
        const customer = await Customer.findOne({id});
        if (!customer) {
            errors.push({
                field: 'id',
                message: 'مشتری مورد نظر یافت نشد'
            });
        }
    }
    return errors
}