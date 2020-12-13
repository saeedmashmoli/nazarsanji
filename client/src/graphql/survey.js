import { gql } from '@apollo/client';
import { SurveyFragments, ErrorFragments } from './fragments'

export const createSurveyMutation = gql `
    mutation CreateSurvey($title : String! , $status : Boolean!){
        createSurvey(input : {title : $title , status : $status }){
            status
            errors{
                ...ErrorFragment
            }
            survey {
                ...SueveyFragment
            }
        }
    }
    ${SurveyFragments.survey}
    ${ErrorFragments.error}
`
export const updateSurveyMutation = gql `
    mutation UpdateSurvey($title : String! , $status : Boolean! , $id : Float!){
        updateSurvey(input : {title : $title , status : $status } , id : $id){
            status
            errors{
                ...ErrorFragment
            }
            survey {
                ...SueveyFragment
            }
        }
    }
    ${SurveyFragments.survey}
    ${ErrorFragments.error}
`
export const deleteSurveyMutation = gql `
    mutation DeleteSurvey($id : Float!){
        deleteSurvey(id : $id){
            status
            errors{
                ...ErrorFragment
            }
        }
    }
    ${ErrorFragments.error}
`