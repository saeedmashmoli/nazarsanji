import { Sms } from "../entities/Sms";
import { Comment } from "../entities/Comment"
import { CommentInput } from "../resolvers/Input"

export const commentValidator = async (input: CommentInput | null = null , id : number | null = null) => {
    let errors = [];
    if(id){
        const comment = await Comment.findOne({id});
        if (!comment) {
            errors.push({
                field: 'id',
                message: 'کامنت مورد نظر یافت نشد'
            });
        }
    }
    if(input?.flag){
        if(input.text === undefined && input.answerIds?.length === 0){
            errors.push({
                field: 'errorText',
                message : 'پاسخگویی به این سوال الزامی است'
            });
        }
    }
    
    return errors
}

export const checkSmsToken = async (token : string) => {
    let errors = [];
    const sms = await Sms.findOne({where : {token}});
    if(!sms){
        errors.push({
            field :'token',
            message : 'توکن مورد نظر وجود ندارد'
        }) 
    }
    if(sms?.used){
        errors.push({
            field :'token',
            message : 'توکن موردنظر منقضی شده است'
        })
    }
    return errors
}