import { loading } from '../stores';


export let setSelectPermissions = async(permissions) => {
    let result = [];
    let a = await permissions.reduce((objectsByKeyValue, obj) => {
        const value = obj['model'];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
    }, [])
    for (const [key, value] of Object.entries(a)) {
        await result.push(value)
    }
    return result;
}
export let notLoading = () => {
    setTimeout(() => { loading.set(false) }, 300)
}



export let checkErrorFn = async(errors, field) => {
    let i = { status: false, message: "" };
    await errors.forEach(err => {
        if (err.field === field) {
            i.status = true;
            i.message = err.message;
        }
    })
    return i;
}
export const updateArrayFn = (array, object) => {
    const index = array.findIndex(item => item.id === object.id);
    return [
        ...array.slice(0, index),
        object,
        ...array.slice(index + 1)
    ]
}