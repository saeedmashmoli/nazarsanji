import { gql } from '@apollo/client';
import { UserFragment, ErrorFragments } from './fragments'


export const createUserMutation = gql `
    mutation CreateUser($name: String!, $mobile: String!, $email: String!, $password: String!) {
        createUser(password: $password, options: { name: $name, mobile: $mobile, email: $email }) {
            status
            errors {
                ...ErrorFragment
            }
        }
    }
    ${ErrorFragments.error}
`

export const loginMutation = gql `
    mutation login($username: String!, $password: String!) {
        login(password: $password, username: $username) {
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
        changePasswordRequest(mobile: $mobile){
            status
            errors{
                ...ErrorFragment
            }
        }
    }
    ${ErrorFragments.error}
`
export const updatePassword = gql `
    mutation ChangePassword( $mobile : String! , $newPassword : String! , $confirmPassword : String! , $code : String! ){
        changePassword(input: {mobile : $mobile, code : $code , newPassword : $newPassword , confirmPassword : $confirmPassword}){
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