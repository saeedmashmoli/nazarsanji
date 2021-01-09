import { gql } from '@apollo/client';
import { CommentFragments, ErrorFragments } from './fragments';

export const getOptionsForCreateAndUpdateCommentQuery = gql `
    query  getOptionsForCreateComment($token : String!){
        getOptionsForCreateComment(token : $token){
            status
            errors {
                ...ErrorFragment
            }
            questions {
                id
                title
                typeId
                turn
                shouldBe
                isUsedOk
                answers {
                    id
                    title
                    image
                    link
                    percent
                }
                conditions {
                    id
                    criteriaId
                    criteria {
                        symbol
                    }
                    answerId
                    consQuestionId
                    questionId
                }
            }
            comments {
                id
                answerId
                questionId
                text
            }
            call{
                id
                issue
                minorIssue
                exactIssue
                callTime
                callCode
                callPrice
                price
                operatorCallTime
                operatorDelayTime
                moshaverCallTime
                moshaverDelayTime
                month
                year
                status
                customerId
                customer {
                    name
                    mobile
                    phone
                }
            }
            parameters {
                id
                title
            }
            smsId
        }
    }
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
                id
                answerId
                questionId
                text
            }
        } 
    }
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
                    id
                    text
                    status
                    createdAt
                    questionId
                    question {
                        title
                    }
                    answerId
                    answer {
                        title
                    }
                    smsId
                    sms {
                        survey {
                            title
                        }
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
    }
    ${ErrorFragments.error}
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
export const checkSmsMutation = gql `
    mutation CheckSms($smsId : Int!){
        checkSms(smsId : $smsId)
    }
`