import { gql } from '@apollo/client';

export const createUserMutation = gql `
    mutation CreateUser($name: String!, $mobile: String!, $email: String!, $password: String!) {
        createUser(password: $password, options: { name: $name, mobile: $mobile, email: $email }) {
            status
            token
            errors {
                field
                message
            }
        }
    }
`