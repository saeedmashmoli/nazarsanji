import { gql } from '@apollo/client';
import { PermissionFragments, ErrorFragments } from './fragments';


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

export const GetPermissionsMutation = gql `
    mutation getPermissions(
        $status : Boolean,
        $title : String,
        $label : String,
        $model : String,
        $permissionId : Int,
        $page : Int,
        $limit : Int,
        $roleIds : [Int!]
    ){
        getPermissions(
            input : {
                status : $status,
                title : $title,
                label : $label,
                model : $model,
                roleIds : $roleIds,
                permissionId : $permissionId
            },
            page : $page,
            limit : $limit
        ) {
            status
            errors {
                ...ErrorFragment
            }
            docs {
                page
                total
                pages
                permissions {
                    ...PermissionFragment
                }
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