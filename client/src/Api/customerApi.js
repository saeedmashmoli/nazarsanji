import client from '../svelte-apollo';
import {
    createCustomerMutation,
    updateCustomerMutation,
    activeOrDeactiveCustomerMutation,
    getCustomersMutation,
    getCustomerQuery
} from '../graphql/customer';
export const createOrUpdateCustomerFn = async(input, id = null) => {
    if (id) {
        const response = await client.mutate({
            mutation: updateCustomerMutation,
            variables: {
                ...input,
                id
            }
        })
        return response.data.updateCustomer;
    } else {
        const response = await client.mutate({
            mutation: createCustomerMutation,
            variables: {
                ...input
            }
        })
        return response.data.createCustomer;
    }
}
export const activeOrDeaciveCustomerFn = async(id, status) => {

    const response = await client.mutate({
        mutation: activeOrDeactiveCustomerMutation,
        variables: {
            id,
            status
        }
    })
    return response.data.activeOrDeactiveCustomer
}
export const getCustomersFn = async(input, page, limit) => {
    const response = await client.mutate({
        mutation: getCustomersMutation,
        variables: {
            ...input,
            page,
            limit
        }
    })
    return response.data.getCustomers
}
export const getCustomerFn = async(id) => {
    const response = await client.query({
        query: getCustomerQuery,
        variables: {
            id
        }
    })

    return response.data.getCustomer
}