import client from '../svelte-apollo';
import {
    createUserMutation,
    updateUserMutation,
    getUsersMutation,
    activeOrDeactiveUserMutation,
    getUserQuery,
    getRolesForCreateAndUpdateUser
} from '../graphql/user';


export const getRolesForCreateOrUpdateUserFn = async() => {
    const response = await client.query({
        query: getRolesForCreateAndUpdateUser
    })
    return response.data.getRolesForCreateUser
}

export const getUsersFn = async(input, page, limit) => {
    const response = await client.mutate({
        mutation: getUsersMutation,
        variables: {
            ...input,
            page,
            limit
        }
    })
    return response.data.getUsers
}
export const getUserFn = async(id) => {
    const response = await client.query({
        query: getUserQuery,
        variables: {
            id
        }
    })

    return response.data.getUser
}
export const activeOrDeaciveUserFn = async(id, active) => {

    const response = await client.mutate({
        mutation: activeOrDeactiveUserMutation,
        variables: {
            id,
            active
        }
    })
    return response.data.activeOrDeactiveUser
}
export const createOrUpdateUserFn = async(input, id = null) => {
    if (id) {
        const response = await client.mutate({
            mutation: updateUserMutation,
            variables: {
                ...input,
                id
            }
        })
        return response.data.updateUser;
    } else {
        const response = await client.mutate({
            mutation: createUserMutation,
            variables: {
                ...input
            }
        })
        return response.data.createUser;
    }
}