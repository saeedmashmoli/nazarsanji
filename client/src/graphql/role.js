import { gql } from '@apollo/client';
import { PermissionFragments, RoleFragments, ErrorFragments } from './fragments';

export const getPermissionsForCreateAndUpdateRole = gql `
    query GetPermissionsForSelectOptions{
        getPermissionsForCreateRole{
            ...PermissionFragment
        }
    }
    ${PermissionFragments.permission}
`

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

export const GetRolesMutation = gql `
    mutation getRoles(
        $status : Boolean,
        $title : String,
        $label : String,
        $roleId : Int,
        $page : Int,
        $limit : Int,
        $permissionIds : [Int!]
    ){
        getRoles(
            input : {
                status : $status,
                title : $title,
                label : $label,
                permissionIds : $permissionIds,
                roleId : $roleId,
            },
            page : $page,
            limit : $limit
        ){
            status
            errors {
                ...ErrorFragment
            }
            docs {
                page
                total
                pages
                roles {
                    ...RoleFragment
                }
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