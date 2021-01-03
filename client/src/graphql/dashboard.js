import { gql } from '@apollo/client';
import { CommentFragments, ErrorFragments } from './fragments';
export const getDashboardDataQuery = gql `
    query getDataForDashboard{
        getDataForDashboard{
            status
            errors {
                ...ErrorFragment
            }
            commentsCount
            smsCount
            comments {
                ...CommentFragment
            }
        }
    }
    ${ErrorFragments.error}
    ${CommentFragments.comment}
`