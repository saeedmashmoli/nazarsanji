import { gql } from '@apollo/client';
import { UserFragment, ErrorFragments, RoleFragments } from './fragments'

export const getRolesForCreateAndUpdateUser = gql `
    query getRolesForCreateUser{
        getRolesForCreateUser{
            ...RoleFragment
        }
    }
    ${RoleFragments.role}
`;
export const activeOrDeactiveUserMutation = gql `
    mutation ActiveOrDeactiveUser($id : Int! , $active : Boolean!){
        activeOrDeactiveUser (id : $id , active : $active){
            status
            errors {
                ...ErrorFragment
            }
        }
    }
    ${ErrorFragments.error}
`

export const getUsersMutation = gql `
    mutation GetUsers(
        $name: String, 
        $mobile: String, 
        $email: String, 
        $active : Boolean, 
        $roleId : Int
        $page : Int,
        $limit : Int
    ){
        getUsers(
            input : {
                name : $name, 
                mobile : $mobile, 
                email : $email, 
                active : $active, 
                roleId : $roleId
            }
            page : $page,
            limit : $limit
        ) {
            status
            errors {
                ...ErrorFragment
            }
            docs {
                total
                page
                pages
                users {
                    ...UserFragment
                }
            }
        }
    }
    ${ErrorFragments.error}
    ${UserFragment.user}
`
export const getUserQuery = gql `
    query GetUser($id : Int!){
        getUser(id : $id){
            status
            errors {
                ...ErrorFragment
            }
            user {
                ...UserFragment
            }
        }
    }
    ${ErrorFragments.error}
    ${UserFragment.user}
`

export const createUserMutation = gql `
    mutation CreateUser(
        $name: String, 
        $mobile: String!, 
        $email: String, 
        $password : String!, 
        $active : Boolean, 
        $roleId : Int
    ) {
        createUser(
            password : $password, 
            options : { 
                name : $name, 
                mobile : $mobile, 
                email : $email , 
                active : $active , 
                roleId : $roleId
            }
        ) {
            status
            errors {
                ...ErrorFragment
            }
        }
    }
    ${ErrorFragments.error}
`
export const updateUserMutation = gql `
    mutation UpdateUser(
        $name : String, 
        $mobile : String!, 
        $email : String, 
        $roleId : Int, 
        $password : String, 
        $active : Boolean, 
        $id : Int!
    ) {
        updateUser(
            password : $password, 
            options : { 
                name : $name, 
                mobile : $mobile, 
                email : $email , 
                active : $active , 
                roleId : $roleId
            }, 
            id : $id
        ) {
            user {
                ...UserFragment
            }
            status
            errors {
                ...ErrorFragment
            }
        }
    }
    ${UserFragment.user}
    ${ErrorFragments.error}
`

export const loginMutation = gql `
    mutation login($username : String!, $password : String!) {
        login(password : $password, username : $username) {
            status
            user {
                ...UserFragment
            }
            errors {
                ...ErrorFragment
            }
        }
    }
    ${UserFragment.user}
    ${ErrorFragments.error}
`
export const LogoutQuery = gql `
    query Logout{
        logout
    }
`
export const MeQuery = gql `
    query Me{
        me{
            ...UserFragment
        }
    }
    ${UserFragment.user}
`

export const changePasswordRequest = gql `
    mutation ChangePasswordRequest($mobile : String!){
        changePasswordRequest(mobile : $mobile){
            status
            errors{
                ...ErrorFragment
            }
        }
    }
    ${ErrorFragments.error}
`
export const updatePassword = gql `
    mutation ChangePassword( 
        $mobile : String! , 
        $newPassword : String! , 
        $confirmPassword : String! , 
        $code : String! 
    ){
        changePassword(
            input : {
                mobile : $mobile, 
                code : $code , 
                newPassword : $newPassword , 
                confirmPassword : $confirmPassword
            }
        ){
            status
            user {
                ...UserFragment
            }
            errors{
                ...ErrorFragment
            }
        }
    }
    ${UserFragment.user}
    ${ErrorFragments.error}
`