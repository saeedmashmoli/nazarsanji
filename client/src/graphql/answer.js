import { gql } from '@apollo/client';
import { AnswerFragments, ErrorFragments, QuestionFragments } from './fragments'

export const getQuestionsForCreateAndUpdateAnswer = gql `
    query getQuestionsForCreateAnswer{
        getQuestionsForCreateAnswer{
            ...QuestionFragment
        }
    }
    ${QuestionFragments.question}
`;
export const createAnswerMutation = gql `
    mutation CreateAnswer( 
        $title : String, 
        $status : Boolean!, 
        $questionId : Int, 
        $link : String, 
        $image : String,
        $percent : Int, 
        $flag : Boolean!
    ){
        createAnswer(
            input : {
                title : $title, 
                status : $status, 
                questionId : $questionId, 
                link : $link, 
                image : $image,
                percent : $percent,
                flag : $flag
            }
        ){
            answer {
                ...AnswerFragment
            }
            status
            errors {
                ...ErrorFragment
            }
        }
    }
    ${AnswerFragments.answer}
    ${ErrorFragments.error}
`
export const updateAnswerMutation = gql `
    mutation UpdateAnswer(        
        $title : String, 
        $status : Boolean!, 
        $questionId : Int, 
        $link : String, 
        $image : String,
        $percent : Int, 
        $flag : Boolean! , 
        $id : Int!
    ){
        updateAnswer(input : {
                title : $title, 
                status : $status, 
                questionId : $questionId, 
                link : $link, 
                image : $image,
                percent : $percent,
                flag : $flag
            }, 
            id : $id
        ){
            answer {
                ...AnswerFragment
            }
            status
            errors {
                ...ErrorFragment
            }
        }
    }
    ${AnswerFragments.answer}
    ${ErrorFragments.error}
`
export const activeOrDeactiveAnswerMutation = gql `
        mutation activeOrDeactiveAnswerMutation($id : Int! , $status : Boolean!){
            activeOrDeactiveAnswer(id : $id , status : $status){
                status
                errors{
                    ...ErrorFragment
                }
            }
        }
        ${ErrorFragments.error}
    `
export const getAnswersMutation = gql `
    mutation GetAnswers(
        $status : Boolean,
        $questionId : Int,
        $link : String,
        $flag : Boolean,
        $title : String,
        $page : Int,
        $limit : Int
    ){
        getAnswers(
            input : {
                title : $title, 
                questionId : $questionId, 
                link : $link, 
                status : $status,
                flag : $flag
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
                answers {
                    ...AnswerFragment
                }
            }
        }
    }
    ${ErrorFragments.error}
    ${AnswerFragments.answer}
`
export const getAnswerQuery = gql `
    query GetAnswer($id : Int!){
        getAnswer(id : $id){
            status
            errors {
                ...ErrorFragment
            }
            answer {
                ...AnswerFragment
            }
        }
    }
    ${ErrorFragments.error}
    ${AnswerFragments.answer}
`