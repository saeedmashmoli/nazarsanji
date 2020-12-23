export const checkObjectField = (object: any) => {
    for (let key in object) {
        let value = object[key];
        if(typeof value === "string" && value.trim().length == 0){
            value = undefined
        }else if(typeof value === "string"){
            value = value.trim()
        }
        object[key] = value;
    }
    return object
}