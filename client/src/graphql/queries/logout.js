import { gql } from '@apollo/client';

export const LogoutQuery = gql `
    query Logout{
        logout
    }
`