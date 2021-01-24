import { gql } from '@apollo/client';
import { SurveyFragments, ErrorFragments } from './fragments'

export const createSurveyMutation = gql `
    mutation CreateSurvey($title : String! , $status : Boolean!){
        createSurvey(input : {title : $title , status : $status }){
            survey {
                ...SurveyFragment
            }
            status
            errors{
                ...ErrorFragment
            }
        }
    }
    ${SurveyFragments.survey}
    ${ErrorFragments.error}
`
export const updateSurveyMutation = gql `
    mutation UpdateSurvey($title : String! , $status : Boolean! , $id : Int!){
        updateSurvey(input : {title : $title , status : $status } , id : $id){
            status
            errors{
                ...ErrorFragment
            }
        }
    }
    ${ErrorFragments.error}
`
export const activeOrDeactiveSurveyMutation = gql `
    mutation activeOrDeactiveSurveyMutation($id : Int! , $status : Boolean!){
        activeOrDeactiveSurvey(id : $id , status : $status){
            status
            errors{
                ...ErrorFragment
            }
        }
    }
    ${ErrorFragments.error}
`
export const getSurveysMutation = gql `
    mutation GetSurveys(
        $surveyId : Int,
        $questionId : Int,
        $smsId : Int,
        $title : String, 
        $status : Boolean,
        $page : Int,
        $limit : Int
    ){
        getSurveys(
            input : {
                surveyId : $surveyId,
                title : $title, 
                status : $status,
                questionId : $questionId,
                smsId : $smsId,
            }
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
                surveys {
                    id
                    title
                    status
                }
            }
        }
    }
    ${ErrorFragments.error}
`
export const getSurveyMutation = gql `
    mutation GetSurvey($id : Int!){
        getSurvey(id : $id){
            status
            errors {
                ...ErrorFragment
            }
            survey {
                ...SurveyFragment
            }
        }
    }
    ${ErrorFragments.error}
    ${SurveyFragments.survey}
`