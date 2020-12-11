import { Token } from "../entities/Token";
import { ChangePasswordInput } from "src/resolvers/Input";
import { User } from "../entities/User";

export const changePasswordValidator = async ( input: ChangePasswordInput , user: User ) => {
    const {  code , newPassword , confirmPassword } = input
    if(!user){
        return [{
            field: "mobile",
            message: "شماره موبایل اشتباه است"
        }];
    }
    const token = await Token.findOne({where : {id : user.tokenId}});
    if(token?.code !== code){
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
    await Token.update({ id: token.id } , { used : 1 })
    if(newPassword !== confirmPassword){
        return [{
            field: "confirmPassword",
            message: "عدم تطابق رمزعبور و تایید آن"
        }];
    }
    return null
}