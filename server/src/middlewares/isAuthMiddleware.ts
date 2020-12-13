import { MyContext } from "src/types";
import { MiddlewareFn } from "type-graphql";
import { verify } from 'jsonwebtoken';
import { User } from "../entities/User";
import { createAccessToken } from "../constants/auth";

export const isAuth: MiddlewareFn<MyContext> = async ({context} , next) => {
    const { req , res } = context;
    const accessToken =  req.cookies["access-token"];
    const refreshToken = req.cookies["refresh-token"];
    if(!accessToken && !refreshToken){
        throw new Error('لطفا وارد سایت شوید')
        // return context.res.status(400).send({
        //     status: false,
        //     message: 'لطفا وارد سایت شوید',
        // });
    }

    try {
        const payload = verify(accessToken.token , process.env.ACCESS_TOKEN_PRIVATE_KEY) as any;
        context.payload = payload as any;
        return next();
    } catch (error) {}

    if(!refreshToken){
        return next();
    }
    let data;
    try {
        data = verify(refreshToken.token , process.env.REFRESH_TOKEN_PRIVATE_KEY) as any;
    } catch (error) {return next()}
    const user = await User.findOne({id : data.userId })
    if(!user || user.tokenVersion !== data.tokenVersion ){
        return next();
    }
    await res.cookie("access-token",{token : await createAccessToken(user!)} , { httpOnly : true });
    context.payload = { userId : user.id } as any
    return next();
}