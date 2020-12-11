import { gql } from '@apollo/client';

export const MeQuery = gql `
    query Me{
        me{
            name
            mobile
            email
        }
    }
`