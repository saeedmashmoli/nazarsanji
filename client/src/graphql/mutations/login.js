import { gql } from '@apollo/client';

export const loginMutation = gql `
    mutation login($username: String!, $password: String!) {
        login(password: $password, username: $username) {
            status
            user {
                name
                mobile
                email
            }
            errors {
                field
                message
            }
        }
    }
`