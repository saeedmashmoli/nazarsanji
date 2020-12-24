import client from '../svelte-apollo';
import {
    CreateRoleMutation,
    activeOrDeactiveRoleMutation,
    GetRoleQuery,
    GetRolesMutation,
    UpdateRoleMutation,
    getPermissionsForCreateAndUpdateRole
} from '../graphql/role';

export let getPermissionsForCreateAndUpdateRoleFn = async() => {
    let response = await client.query({
        query: getPermissionsForCreateAndUpdateRole
    })
    return response.data.getPermissionsForCreateRole
}
export let getRolesFn = async(input, page, limit) => {
    let response = await client.mutate({
        mutation: GetRolesMutation,
        variables: {
            ...input,
            page,
            limit
        }
    })
    return response.data.getRoles
}
export const getRoleFn = async(id) => {
    let response = await client.query({
        query: GetRoleQuery,
        variables: {
            id
        }
    })
    return response.data.getRole
}
export let createOrUpdateRoleFn = async(input, id = null) => {
    if (id) {
        const response = await client.mutate({
            mutation: UpdateRoleMutation,
            variables: {
                ...input,
                id
            }
        })
        return response.data.updateRole;
    } else {
        const response = await client.mutate({
            mutation: CreateRoleMutation,
            variables: {
                ...input
            }
        })
        return response.data.createRole;
    }
}
export const activeOrDeactiveRoleFn = async(id, status) => {
    const response = await client.mutate({
        mutation: activeOrDeactiveRoleMutation,
        variables: {
            id,
            status
        }
    })
    return response.data.activeOrDeactiveRole
}