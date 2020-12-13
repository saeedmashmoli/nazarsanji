import { UserRegisterInput } from "../resolvers/Input";


export const createUserValidator = (options: UserRegisterInput , password : string) => {
    let errors = [];
    if(options.mobile.length === 0 ){
        errors.push({
            field: 'mobile',
            message : 'وارد کردن موبایل الزامی است'
        })
    }
    if(options.mobile.length !== 11){
        errors.push({
            field: 'mobile',
            message : 'موبایل وارد شده اشتباه است'
        });
    }
    if(options.email?.length !== 0 && !options.email?.includes('@')){
        errors.push({
            field: 'email',
            message : 'ایمیل وارد شده معتبر نیست'
        });
    }
    if(password.length < 3 ){
        errors.push({
            field: 'password',
            message : 'رمز عبور بایستی بیشتر از دو کاراکتر باشد'
        });
    }
    
    return errors
}