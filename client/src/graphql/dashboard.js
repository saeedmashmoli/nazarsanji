import { gql } from '@apollo/client';
import { ErrorFragments } from './fragments';
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
                id
                text
                sms {
                    call {
                        customer {
                            name
                            mobile
                        }
                    }
                }
            }
        }
    }
    ${ErrorFragments.error}
`