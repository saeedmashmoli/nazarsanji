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

export const generateUniqueString = async (length : number) =>{
    let time = new Date().getTime().toString().substring(3,13)
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result +=  characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return time.substring(0, 3) + result.substring(1,3) + time.substring(4, 7) + result.substring(4,7)  +time.substring(8,13);
}
