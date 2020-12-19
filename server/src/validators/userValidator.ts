import { UserRegisterInput } from "../resolvers/Input";
import { Token } from "../entities/Token";
import { ChangePasswordInput } from "../resolvers/Input";
import { User } from "../entities/User";


export const createUserValidator = (options: UserRegisterInput , password : string , createFlag : boolean) => {
    let errors = [];
    if(options.mobile == null ){
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
    if(createFlag){
        if(password.length < 3 ){
            errors.push({
                field: 'password',
                message : 'رمز عبور بایستی بیشتر از دو کاراکتر باشد'
            });
        }
    }
    if(createFlag){
        if(options.roleId === null){
            errors.push({
                field: 'roleId',
                message : 'لطفا نقش کاربر را انتخاب کنید '
            });
        }
    }
    
    return errors
}


export const changePasswordValidator = async ( input: ChangePasswordInput , user: User ) => {
    const {  code , newPassword , confirmPassword } = input
    if(!user){
        return [{
            field: "mobile",
            message: "شماره موبایل اشتباه است"
        }];
    }
    const token = await Token.findOne({where : {id : user.tokenId}});
    if(token?.code !== parseInt(code)){
        return [{
            field: "code",
            message: "کد تایید اشتباه است"
        }];
    }
    let now = new Date().valueOf();
    let createdAt = new Date(token!.createdAt).valueOf();
    let time = parseInt(process.env.CHANGE_PASSWORD_EXPIRED_TIME) * 1000
    if(token?.used == 1 || now - createdAt > time){
        return [{
            field: "code",
            message: "کد تایید منقضی شده است"
        }];
    }
    if(newPassword !== confirmPassword){
        return [{
            field: "confirmPassword",
            message: "عدم تطابق رمز عبور و تایید آن"
        }];
    }
    // await Token.update({ id: token.id } , { used : 1 })
    return null
}