import { gql } from '@apollo/client';
import { LogFragments, ErrorFragments, UserFragment } from './fragments';


export const getUsersAndModelsForShowLogsQuery = gql `
    query  getPackagesAndTemplatesForCreateSms{
        getUsersAndModelsForShowLogs{
            status
            errors {
                ...ErrorFragment
            }
            models {
                id
                title
                label
            }
            users {
                ...UserFragment
            }
           
        }
    }
    ${UserFragment.user}
    ${ErrorFragments.error}
`;

export const getLogsMutation = gql `
    mutation GetLogs(
        $rowId : Int,
        $modelId : Int,
        $userId : Int, 
        $operation : String,
        $page : Int,
        $limit : Int
    ){
        getLogs(
            input : {
                operation : $operation,
                userId : $userId, 
                modelId : $modelId,
                rowId : $rowId
            },
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
                logs {
                    ...LogFragment
                }
            }
        }
    }
    ${ErrorFragments.error}
    ${LogFragments.log}
`