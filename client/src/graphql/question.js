import { gql } from '@apollo/client';
import { QuestionFragments, ErrorFragments } from './fragments'

export const createQuestionMutation = gql `
    mutation CreateQuestion($title : String! , $status : Boolean!){
        createQuestion(input : {title : $title , status : $status }){
            status
            errors{
                ...ErrorFragment
            }
            question {
                ...QustionFragment
            }
        } 
    }
    ${QuestionFragments.question}
    ${ErrorFragments.error}
`
export const updateQuestionMutation = gql `
    mutation UpdateQuestion($title : String! , $status : Boolean! , $id : Float!){
        updateQuestion(input : {title : $title , status : $status } , id : $id){
            status
            errors{
                ...ErrorFragment
            }
            question {
                ...QustionFragment
            }
        } 
    }
    ${QuestionFragments.question}
    ${ErrorFragments.error}
`
export const deleteQuestionMutation = gql `
    mutation DeleteQuestion($id : Float!){
        deleteQuestion(id : $id){
            status
            errors{
                ...ErrorFragment
            }
        }
    }
    ${ErrorFragments.error}
`