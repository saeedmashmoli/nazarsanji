import { Upload } from "../types";
import { Package } from "../entities/Package"
import { PackageInput } from "../resolvers/Input"

export const packageValidator = async (input: PackageInput | null , id: number | null , file: Upload | null) => {
    let errors = [];
    if(id){
        const p = await Package.findOne({id});
        if (!p) {
            errors.push({
                field: 'id',
                message: 'بسته مورد نظر یافت نشد'
            });
        }
    }
    if(input){
        if(input.title.length === 0 ){
            errors.push({
                field: 'title',
                message : 'فیلد عنوان الزامی است'
            });
        }
    }
    if(file){
        if(!file.mimetype.includes("excel") && !file.mimetype.includes("spreadsheetml")){
            errors.push({
                field: 'file',
                message : 'فایل مورد نظر بایستی اکسل باشد'
            })
        }
    }

    return errors
}
