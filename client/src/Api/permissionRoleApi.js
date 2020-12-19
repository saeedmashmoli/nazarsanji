import client from '../svelte-apollo';
import {
    CreateRoleMutation,
    DeleteRoleMutation,
    GetPermissionQuery,
    GetPermissionsMutation,
    GetRoleQuery,
    GetRolesMutation,
    UpdateRoleMutation,
    DeletePermissionMutation,
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
export let getRolesFn = async(status) => {
    let response = await client.mutate({
        mutation: GetRolesMutation,
        variables: {
            status
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
export const getPermissionFn = async(id) => {
    let response = await client.query({
        query: GetPermissionQuery,
        variables: {
            id
        }
    })
    return response.data
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
export const deleteRoleFn = async(id) => {
    const response = await client.mutate({
        mutation: DeleteRoleMutation,
        variables: {
            id
        }
    })
    return response.data.deleteRole
}

export const deletePermissionFn = async(id) => {
    const response = await client.mutate({
        mutation: DeletePermissionMutation,
        variables: {
            id
        }
    })
    return response.data.deletePermission
}