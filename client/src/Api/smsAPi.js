import client from '../svelte-apollo';
import {
    createSmsMutation,
    activeOrDeactiveSmsMutation,
    getSendsMutation,
    getSmsQuery,
    getPackagesAndTemplatesForCreateSmsQuery
} from '../graphql/sms';
export const createSmsFn = async(input) => {
    const response = await client.mutate({
        mutation: createSmsMutation,
        variables: {
            ...input
        }
    })
    return response.data.createSms;
}
export const activeOrDeaciveSmsFn = async(id, status) => {

    const response = await client.mutate({
        mutation: activeOrDeactiveSmsMutation,
        variables: {
            id,
            status
        }
    })
    return response.data.activeOrDeactiveSms
}
export const getPackagesAndTemplatesForCreateSmsFn = async() => {
    const response = await client.query({
        query: getPackagesAndTemplatesForCreateSmsQuery
    })
    return response.data.getPackagesAndTemplatesForCreateSms
}
export const getSendsFn = async(input, page, limit) => {
    const response = await client.mutate({
        mutation: getSendsMutation,
        variables: {
            ...input,
            page,
            limit
        }
    })
    return response.data.getSends
}
export const getSmsFn = async(id) => {
    const response = await client.query({
        query: getSmsQuery,
        variables: {
            id
        }
    })

    return response.data.getSms
}