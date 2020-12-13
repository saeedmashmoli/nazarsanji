import { User } from "../entities/User";
import { Token } from "../entities/Token";

export const deleteTokensJobs = async () => {
    let now = new Date().valueOf();
    let time = parseInt(process.env.CHANGE_PASSWORD_EXPIRED_TIME) * 1000
    const tokens = await Token.find({});
    tokens.forEach(token => {
        let createdAt = new Date(token!.createdAt).valueOf();
        if(now - createdAt > time){
            Token.delete({id : token.id});
            User.update({tokenId : token.id} , { tokenId : 0 })
        }
    });
}