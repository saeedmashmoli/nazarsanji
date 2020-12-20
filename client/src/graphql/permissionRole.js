import { gql } from '@apollo/client';
import { PermissionFragments, RoleFragments, ErrorFragments } from './fragments';

export const CreateRoleMutation = gql `
    mutation CreateRole(
        $title : String!, 
        $label : String!, 
        $status : Boolean!, 
        $permissions : [String!]!
    ) {
        createRole( 
            input : {
                title : $title , 
                label : $label , 
                status : $status , 
                permissions : $permissions
            }
        ){
            status
            errors {
                ...ErrorFragment
            }
        }
    }
    ${ErrorFragments.error}
`
export const CreatePermissionMutation = gql `
    mutation CreatePermission(
        $title: String!, 
        $label: String!, 
        $model: String! , 
        $status : Boolean!
    ) {
        createPermission(
            input : {
                title : $title, 
                label : $label, 
                model : $model,
                status : $status
            }
        ){
            status
            errors {
                ...ErrorFragment
            }
        }
    }
    ${ErrorFragments.error}
`
export const UpdateRoleMutation = gql `
    mutation UpdateRole(        
        $title : String!, 
        $label : String!, 
        $status : Boolean!, 
        $permissions : [String!]!, 
        $id : Int!
    ) {
        updateRole(
            input : {
                title : $title , 
                label : $label , 
                status : $status , 
                permissions : $permissions
            }, 
            id : $id
        ){
            status
            errors {
                ...ErrorFragment
            }
        }
    }
    ${ErrorFragments.error}
`
export const UpdatePermissionMutation = gql `
    mutation UpdatePermissionMutation(        
        $title: String!, 
        $label: String!, 
        $model: String! , 
        $status : Boolean!, 
        $id : Int! 
    ) {
        updatePermission(
            input : {
                title : $title, 
                label : $label, 
                model : $model,
                status : $status
            }, 
            id : $id
        ){
            status
            errors {
                ...ErrorFragment
            }
        }
    }
    ${ErrorFragments.error}
`
export const activeOrDeactiveRoleMutation = gql `
    mutation ActiveOrDeactiveRole($id : Int! , $status : Boolean!) {
        activeOrDeactiveRole(id : $id , status : $status){
            status
            errors{
                ...ErrorFragment
            }
        }
    }
    ${ErrorFragments.error}
`
export const activeOrDeactivePermissionMutation = gql `
    mutation ActiveOrDeactivePermission($id : Int! , $status : Boolean!) {
        activeOrDeactivePermission(id : $id , status : $status){
            status
            errors{
                ...ErrorFragment
            }
        }
    }
    ${ErrorFragments.error}
`
export const GetRolesMutation = gql `
    mutation getRoles($status : Boolean!){
        getRoles(status : $status){
            status
            errors {
                ...ErrorFragment
            }
            roles{
                ...RoleFragment
            }
        }
    }
    ${RoleFragments.role}
    ${ErrorFragments.error}
`
export const GetRoleQuery = gql `
    query getRole($id : Int!){
        getRole(id : $id){
            status
            errors {
                ...ErrorFragment
            }
            role {
                ...RoleFragment
            }
        }
    }
    ${RoleFragments.role}
    ${ErrorFragments.error}
`
export const GetPermissionsMutation = gql `
    mutation getPermissions($status : Boolean!){
        getPermissions(status : $status) {
            status
            errors {
                ...ErrorFragment
            }
            permissions {
                ...PermissionFragment
            }
        }
    }
    ${ErrorFragments.error}
    ${PermissionFragments.permission}
`
export const GetPermissionQuery = gql `
    query getPermission($id : Int!){
        getPermission(id : $id) {
            status
            errors {
                ...ErrorFragment
            }
            permission {
                ...PermissionFragment
            }
        }
    }
    ${ErrorFragments.error}
    ${PermissionFragments.permission}
`