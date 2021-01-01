import { gql } from '@apollo/client';
import { CommentFragments, QuestionFragments, ErrorFragments } from './fragments';

export const getOptionsForCreateAndUpdateCommentQuery = gql `
    query  getOptionsForCreateComment($token : String!){
        getOptionsForCreateComment(token : $token){
            status
            errors {
                ...ErrorFragment
            }
            questions {
                ...QuestionFragment
            }
            comments {
                ...CommentFragment
            }
            smsId
        }
    }
    ${QuestionFragments.question}
    ${CommentFragments.comment}
    ${ErrorFragments.error}
`;
export const createCommentMutation = gql `
    mutation CreateComment(
        $smsId : Int!,
        $questionId : Int!,
        $answerIds : [Int!],
        $text : String,
        $flag : Boolean
    ){
        createComment(
            input : { 
                smsId : $smsId,
                questionId : $questionId,
                answerIds : $answerIds,
                text : $text,
                flag : $flag
            }
        ){
            status
            errors{
                ...ErrorFragment
            }
            comments {
                ...CommentFragment
            }
        } 
    }
    ${CommentFragments.comment}
    ${ErrorFragments.error}
`
export const updateCommentMutation = gql `
    mutation UpdateComment(
        $id : Int!,
        $smsId : Int!,
        $questionId : Int!,
        $answerIds : [Int!],
        $text : String,
        $flag : Boolean
    ){
        updateComment(
            input : { 
                smsId : $smsId,
                questionId : $questionId,
                answerIds : $answerIds,
                text : $text,
                flag : $flag
            },
            id : $id
        ){
            status
            errors{
                ...ErrorFragment
            }
        } 
    }
    ${ErrorFragments.error}
`
export const activeOrDeactiveCommentMutation = gql `
    mutation activeOrDeactiveCommentMutation($id : Int! , $status : Boolean!){
        activeOrDeactiveComment( id : $id , status : $status){
            status
            errors{
                ...ErrorFragment
            }
        }
    }
    ${ErrorFragments.error}
`
export const getCommentsMutation = gql `
    mutation GetComments(
        $customerId: Int,
        $callId: Int,
        $smsId: Int
        $answerId: Int,
        $questionId: Int,
        $typeId: Int,
        $text: String,
        $status : Boolean,
        $page: Int,
        $limit: Int
    ){
        getComments(
            input : {
                status : $status,
                customerId : $customerId,
                callId : $callId,
                smsId : $smsId,
                answerId : $answerId,
                questionId : $questionId,
                typeId : $typeId,
                text : $text
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
                comments {
                    ...CommentFragment
                }
            }
        }
    }
    ${ErrorFragments.error}
    ${CommentFragments.comment}
`
export const getCommentQuery = gql `
    query GetComment($id : Int!){
        getComment(id : $id){
            status
            errors {
                ...ErrorFragment
            }
            comment {
                ...CommentFragment
            }
        }
    }
    ${ErrorFragments.error}
    ${CommentFragments.comment}
`