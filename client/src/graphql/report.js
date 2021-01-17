import { gql } from '@apollo/client';
import { ErrorFragments } from './fragments';
export const getSurveysForReportsQuery = gql `
    query getSurveysForReports{
        getSurveysForReports{
            id
            title
            status
            questions { 
                id
                title
                typeId
                status
            }
        }
    }
`
export const getCommentReportDataMutation = gql `
    query getDataForCommentReport(
        $beginDate : String,
        $endDate : String,
        $beginTime : String,
        $endTime : String,
        $surveyId : Int,
        $questionId : Int
    ){
        getDataForCommentReport(
            input : {
                beginDate : $beginDate,
                endDate : $endDate,
                beginTime : $beginTime,
                endTime : $endTime,
                surveyId : $surveyId,
                questionId : $questionId,
            }
        ){
            status
            errors {
                ...ErrorFragment
            }
            data {
                label
                value
            }
        }
    }
    ${ErrorFragments.error}
`