import { gql } from '@apollo/client';
import { AnswerFragments, ErrorFragments } from './fragments'

export const createAnswerMutation = gql `
    mutation CreateAnswer( $title : String! , $status : Boolean! , $questionId : Float! , $link : String! , $image : String! ,$percent : Float!, $flag : Boolean!){
        createAnswer(input : {title : $title , status : $status , questionId : $questionId , link : $link , image : $image ,percent : $percent, flag : $flag}){
            status
            errors {
                ...ErrorFragment
            }
            answer {
                ...AnswerFragment
            }
        }
    }
    ${AnswerFragments.answer}
    ${ErrorFragments.error}
`
export const updateAnswerMutation = gql `
    mutation UpdateAnswer($title : String! , $status : Boolean! , $questionId : Float! , $link : String! , $image : String! ,$percent : Float!, $flag : Boolean! , $id : Float!){
        updateAnswer(input : {title : $title , status : $status , questionId : $questionId , link : $link , image : $image ,percent : $percent, flag : $flag} , id : $id){
            status
            errors {
                ...ErrorFragment
            }
            answer {
                ...AnswerFragment
            }
        }
    }
    ${AnswerFragments.answer}
    ${ErrorFragments.error}
`
export const deleteAnswerMutation = gql `
    mutation DeleteAnswer($id : Float!){
        deleteAnswer(id : $id){
            status
            errors{
                ...ErrorFragment
            }
        }
    }
    ${ErrorFragments.error}
`