import { gql } from '@apollo/client';
import { QuestionFragments, ErrorFragments, TypeFragments } from './fragments'

export const createQuestionMutation = gql `
    mutation CreateQuestion(
        $title : String!, 
        $status : Boolean!, 
        $shouldBe : Boolean!, 
        $typeId : Int, 
        $surveyId : Int
    ){
        createQuestion(
            input : {
                title : $title, 
                status : $status, 
                shouldBe : $shouldBe, 
                typeId : $typeId, 
                surveyId : $surveyId
            }
        ){
            status
            errors{
                ...ErrorFragment
            }
        } 
    }
    ${ErrorFragments.error}
`
export const updateQuestionMutation = gql `
    mutation UpdateQuestion(
        $title : String!, 
        $status : Boolean!, 
        $id : Int!, 
        $shouldBe : Boolean!, 
        $typeId : Int, 
        $surveyId : Int
    ){
        updateQuestion(
            input : {
                title : $title, 
                status : $status, 
                shouldBe : $shouldBe, 
                typeId : $typeId, 
                surveyId : $surveyId
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
export const activeOrDeactiveQuestionMutation = gql `
    mutation activeOrDeactiveMutation($id : Int! , $status : Boolean!){
        activeOrDeactiveQuestion( id : $id , status : $status ){
            status
            errors{
                ...ErrorFragment
            }
        }
    }
    ${ErrorFragments.error}
`
export const getQuestionsMutation = gql `
    mutation GetQuestions($status : Boolean!){
        getQuestions(status : $status) {
            status
            errors {
                ...ErrorFragment
            }
            questions {
                ...QuestionFragment
            }
        }
    }
    ${ErrorFragments.error}
    ${QuestionFragments.question}
`
export const getTypesQuery = gql `
    query GetTypesQuery{
        getTypes{
            status
            errors {
                ...ErrorFragment
            }
            types {
                ...TypeFragment
            }
        }
    }
    ${ErrorFragments.error}
    ${TypeFragments.type}
`
export const getQuestionQuery = gql `
    query GetQuestion($id : Int!){
        getQuestion(id : $id){
            status
            errors {
                ...ErrorFragment
            }
            question {
                ...QuestionFragment
            }
        }
    }
    ${ErrorFragments.error}
    ${QuestionFragments.question}
`