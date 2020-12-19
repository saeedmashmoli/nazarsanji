import { Package } from "../entities/Package"
import { PackageInput } from "../resolvers/Input"

export const packageValidator = (input: PackageInput) => {
    if(input.title.length === 0 ){
        return [{
            field: 'title',
            message : 'فیلد عنوان الزامی است'
        }]
    }
    return null
}
export const updateOrDeletePackageValidator = async (id: number) => {
    const p = await Package.findOne({id});
    if (!p) {
        return [{
            field: 'id',
            message: 'بسته مورد نظر یافت نشد'
        }];
    }
    return null
}