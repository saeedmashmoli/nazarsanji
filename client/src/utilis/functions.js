import { loading } from '../stores';
import { getCustomersFn } from '../Api/customerApi';

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
export const changeTabs = (value) => {
    const tabs = document.querySelectorAll(".tabs")[0].children[0].children;
    const tabContents = document.querySelectorAll(".tab-content")[0].children;
    for (let item of tabContents) {
        if (item.getAttribute("value") == value) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    }
    for (let item of tabs) {
        if (item.value === value) {
            item.classList.add("is-active");
        } else {
            item.classList.remove("is-active");
        }
    }
}
export const actveOrDeactiveFn = async(status, objectStatus, parameter) => {
    if (status === true) {
        if (objectStatus === true) {
            window.pushToast(`${parameter} مورد نظر با موفقیت فعال شد`, "green")
        } else {
            window.pushToast(`${parameter} مورد نظر با موفقیت غیر فعال شد`, "red")
        }
    } else {
        window.pushToast(`مشکلی در تغییر وضعیت ${parameter} بوجود آمده است`, "black")
    }
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

export const optionIdentifier = 'id';
export const getOptionLabel = (option) => option.name || option.title;
export const getSelectionLabel = (option) => option.name || option.title;

export const loadSelectOptionsCustomers = async(filterText) => {
    filterText = filterText ? filterText.replace(' ', '_') : '';
    if (filterText.length >= 3) {
        const cus = await getCustomersFn({ status: true, name: filterText }, 1, 20);
        if (cus.status) {
            return cus.docs.customers
        }
    }
}