import { gql } from '@apollo/client';
import { CriteriaFragments, SurveyFragments, ErrorFragments, QuestionFragments, AnswerFragments, ConditionFragments } from './fragments';

export const getOptionsForCreateAndUpdateConditionQuery = gql `
    query  getOptionsForCreateAndUpdateCondition{
        getOptionsForCreateAndUpdateCondition{
            status
            errors {
                ...ErrorFragment
            }
            surveys {
                ...SurveyFragment
            }
            criterias {
                ...CriteriaFragment
            }
        }
    }
    ${CriteriaFragments.criteria}
    ${SurveyFragments.survey}
    ${ErrorFragments.error}
`;
export const getAnswersForCreateAndUpdateConditionQuery = gql `
    query  getAnswersForCreateAndUpdateCondition($questionId : Int!){
        getAnswersForCreateAndUpdateCondition(questionId : $questionId){
            ...AnswerFragment
        }
    }
    ${AnswerFragments.answer}
`;
export const getQuestionsForCreateAndUpdateConditionQuery = gql `
    query  getQuestionsForCreateAndUpdateCondition($surveyId : Int!){
        getQuestionsForCreateAndUpdateCondition(surveyId : $surveyId){
            ...QuestionFragment
        }
    }
    ${QuestionFragments.question}
`;


export const createConditionMutation = gql `
    mutation CreateCondition(
        $consQuestionId : Int,
        $questionId : Int, 
        $answerId : Int,
        $criteriaId : Int,
        $status : Boolean
    ){
        createCondition(
            input : { 
                consQuestionId : $consQuestionId,
                criteriaId : $criteriaId,
                answerId : $answerId,
                questionId : $questionId,
                status : $status
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
export const updateConditionMutation = gql `
    mutation UpdateCondition(
        $consQuestionId : Int,
        $id : Int!,
        $questionId : Int, 
        $answerId : Int,
        $criteriaId : Int,
        $status : Boolean
    ){
        updateCondition(
            input : { 
                consQuestionId : $consQuestionId,
                criteriaId : $criteriaId,
                answerId : $answerId,
                questionId : $questionId,
                status : $status
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
export const activeOrDeactiveConditionMutation = gql `
    mutation activeOrDeactiveConditionMutation($id : Int! , $status : Boolean!){
        activeOrDeactiveCondition( id : $id , status : $status){
            status
            errors{
                ...ErrorFragment
            }
        }
    }
    ${ErrorFragments.error}
`
export const getConditionsMutation = gql `
    mutation GetConditions(
        $surveyId: Int,
        $status : Boolean,
        $page: Int,
        $limit: Int
    ){
        getConditions(
            input : {
                status : $status,
                surveyId : $surveyId,
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
                conditions {
                    ...ConditionFragment
                }
            }
        }
    }
    ${ErrorFragments.error}
    ${ConditionFragments.condition}
`
export const getConditionMutation = gql `
    mutation GetCondition($id : Int!){
        getCondition(id : $id){
            status
            errors {
                ...ErrorFragment
            }
            condition {
                ...ConditionFragment
            }
        }
    }
    ${ErrorFragments.error}
    ${ConditionFragments.condition}
`