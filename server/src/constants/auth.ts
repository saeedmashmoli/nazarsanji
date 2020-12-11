import { User } from "../entities/User";
import { sign } from 'jsonwebtoken';

export const createAccessToken = (user: User) => {
    return sign(
        { userId : user.id }, 
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
        { expiresIn : process.env.CREATE_ACCESS_TOKEN_TIME }
    );
}
export const createRefreshToken = (user: User) => {
    return sign(
        { userId : user.id, tokenVersion : user.tokenVersion }, 
        process.env.REFRESH_TOKEN_PRIVATE_KEY,
        { expiresIn : process.env.CREATE_REFRESH_TOKEN_TIME }
    );
}