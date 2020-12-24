import client from '../svelte-apollo';
import {
    CreateRoleMutation,
    activeOrDeactiveRoleMutation,
    GetPermissionQuery,
    GetPermissionsMutation,
    GetRoleQuery,
    GetRolesMutation,
    UpdateRoleMutation,
    activeOrDeactivePermissionMutation,
    UpdatePermissionMutation,
    CreatePermissionMutation
} from '../graphql/permissionRole';
export let getPermissionsFn = async(status) => {
    const response = await client.mutate({
        mutation: GetPermissionsMutation,
        variables: {
            status
        }
    })
    return response.data.getPermissions
}

export const getPermissionFn = async(id) => {
    let response = await client.query({
        query: GetPermissionQuery,
        variables: {
            id
        }
    })
    return response.data
}

export let createOrUpdatePermissionFn = async(input, id = null) => {
    if (id) {
        const response = await client.mutate({
            mutation: UpdatePermissionMutation,
            variables: {
                ...input,
                id
            }
        })
        return response.data.updatePermission;
    } else {
        const response = await client.mutate({
            mutation: CreatePermissionMutation,
            variables: {
                ...input
            }
        })
        return response.data.createPermission;
    }
}


export const activeOrDeactivePermissionFn = async(id, status) => {
    const response = await client.mutate({
        mutation: activeOrDeactivePermissionMutation,
        variables: {
            id,
            status
        }
    })
    return response.data.activeOrDeactivePermission
}