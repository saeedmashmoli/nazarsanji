import client from '../svelte-apollo';
import {
    createParameterMutation,
    updateParameterMutation,
    activeOrDeactiveParameterMutation,
    getParametersMutation,
    getParameterQuery
} from '../graphql/parameter';
export const createOrUpdateParameterFn = async(input, id = null) => {

    if (id) {
        const response = await client.mutate({
            mutation: updateParameterMutation,
            variables: {
                ...input,
                id
            }
        })
        return response.data.updateParameter;
    } else {
        const response = await client.mutate({
            mutation: createParameterMutation,
            variables: {
                ...input
            }
        })
        return response.data.createParameter;
    }
}
export const activeOrDeaciveParameterFn = async(id, status) => {

    const response = await client.mutate({
        mutation: activeOrDeactiveParameterMutation,
        variables: {
            id,
            status
        }
    })
    return response.data.activeOrDeactiveParameter
}


export const getParametersFn = async(input, page, limit) => {
    const response = await client.mutate({
        mutation: getParametersMutation,
        variables: {
            ...input,
            page,
            limit
        }
    })
    return response.data.getParameters
}
export const getParameterFn = async(id) => {
    const response = await client.query({
        query: getParameterQuery,
        variables: {
            id
        }
    })

    return response.data.getParameter
}