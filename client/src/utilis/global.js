export const getMiddleArray = (total, middle, current) => {
    let result = [];
    if (total > 2) {
        const array = forLoop(total);
        array.map(arr => {
            if (arr !== total && arr !== 1 && (current - total) <= (middle) && (current - arr) <= middle && (arr - current) <= middle) {
                result.push(arr)
            }
        })
    }
    return result
}

export const forLoop = (num) => {
    let array = [];
    let i = 1;
    for (i; i <= num; i++) {
        array.push(i)
    }
    return array;
}
export const groupBy = (key) => array => {
    array.reduce((objectsByKeyValue, obj) => {
        const value = obj[key];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
    }, {});
}