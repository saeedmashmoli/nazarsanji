import { gql } from '@apollo/client';

export const CreateRoleMutation = gql `
    mutation CreateRole($title: String!, $label: String!) {
        createRole(title : $title , label: $label)
    }
`
export const CreatePermissionMutation = gql `
    mutation CreatePermission($title: String!, $label: String!, $model: String!) {
        createPermission(title : $title , label: $label , model : $model)
    }
`
export const UpdateRoleMutation = gql `
    mutation UpdateRole($title: String!, $label: String! , $id : Int!) {
        updateRole(title : $title , label: $label , id , $id)
    }
`
export const UpdatePermissionMutation = gql `
    mutation CreateRole($title: String!, $label: String! , $id : Int! , $model: String!) {
        createRole(title : $title , label: $label , model : $model , id , $id)
    }
`
export const DeleteRoleMutation = gql `
    mutation DeleteRole($id : Int!) {
        deleteRole
    }
`
export const DeletePermissionMutation = gql `
    mutation DeletePermission($id : Int!) {
        deletePermission
    }
`
export const GetRolesQuery = gql `
    query getRoles{
        getRoles{
            id
            label
            title
        }
    }
`
export const GetPermissionQuery = gql `
    query getPermissions{
        getPermissions {
            id
            label
            title
            model
        }
    }
`