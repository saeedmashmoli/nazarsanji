import client from '../svelte-apollo';
import {
    createCallMutation,
    updateCallMutation,
    activeOrDeactiveCallMutation,
    getCallsMutation,
    getCallQuery,
    getOptionsForCreateAndUpdateCallQuery
} from '../graphql/call';
export const getOptionsForCreateAndUpdateCallFn = async() => {
    const response = await client.query({
        query: getOptionsForCreateAndUpdateCallQuery
    })
    return response.data.getOptionsForCreateAndUpdateCall
}
export const createOrUpdateCallFn = async(input, packageIds = [], id = null) => {
    if (id) {
        const response = await client.mutate({
            mutation: updateCallMutation,
            variables: {
                ...input,
                packageIds,
                id
            }
        })
        return response.data.updateCall;
    } else {
        const response = await client.mutate({
            mutation: createCallMutation,
            variables: {
                ...input,
                packageIds
            }
        })
        return response.data.createCall;
    }
}
export const activeOrDeaciveCallFn = async(id, status) => {

    const response = await client.mutate({
        mutation: activeOrDeactiveCallMutation,
        variables: {
            id,
            status
        }
    })
    return response.data.activeOrDeactiveCall
}
export const getCallsFn = async(input, page, limit) => {
    const response = await client.mutate({
        mutation: getCallsMutation,
        variables: {
            ...input,
            page,
            limit
        }
    })
    return response.data.getCalls
}
export const getCallFn = async(id) => {

    const response = await client.query({
        query: getCallQuery,
        variables: {
            id
        }
    })

    return response.data.getCall
}