import { CustomerInput } from "../resolvers/Input"
import { Customer } from "../entities/Customer"

export const customerValidator = (input: CustomerInput) => {
    let errors = [];
    if(input.mobile !== null && input.mobile!.length !== 11){
        errors.push({
            field: 'mobile',
            message : 'موبایل وارد شده اشتباه است'
        });
    }
    
    return null
}
export const updateOrDeleteCustomerValidator = async (id: number) => {
    const customer = await Customer.findOne({id});
    if (!customer) {
        return [{
            field: 'id',
            message: 'مشتری مورد نظر یافت نشد'
        }];
    }
    return null
}