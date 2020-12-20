import { gql } from '@apollo/client';
import { AnswerFragments, ErrorFragments } from './fragments'

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
            status
            errors {
                ...ErrorFragment
            }
        }
    }
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
            status
            errors {
                ...ErrorFragment
            }
        }
    }
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
    mutation GetAnswers($status : Boolean!){
        getAnswers(status : $status) {
            status
            errors {
                ...ErrorFragment
            }
            answers {
                ...AnswerFragment
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