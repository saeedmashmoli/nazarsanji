import { gql } from '@apollo/client';
import { QuestionFragments, ErrorFragments, TypeFragments, CriteriaFragments } from './fragments'

export const getTypesForCreateQuestion = gql `
    query getTypesForCreateQuestion{
        getTypesForCreateQuestion{
            status
            types {
                ...TypeFragment
            }
            criterias {
                ...CriteriaFragment
            }
        }
    }
    ${CriteriaFragments.criteria}
    ${TypeFragments.type}
`;
export const createQuestionMutation = gql `
    mutation CreateQuestion(
        $title : String,
        $turn : Int,  
        $status : Boolean, 
        $shouldBe : Boolean,
        $isUsedOk : Boolean, 
        $typeId : Int, 
        $surveyId : Int
    ){
        createQuestion(
            input : {
                turn : $turn,
                title : $title, 
                status : $status, 
                shouldBe : $shouldBe, 
                typeId : $typeId, 
                surveyId : $surveyId,
                isUsedOk : $isUsedOk
            }
        ){
            question {
                ...QuestionFragment
            }
            status
            errors{
                ...ErrorFragment
            }
        } 
    }
    ${QuestionFragments.question}
    ${ErrorFragments.error}
`
export const updateQuestionMutation = gql `
    mutation UpdateQuestion(
        $title : String, 
        $turn : Int,
        $status : Boolean, 
        $id : Int!, 
        $shouldBe : Boolean, 
        $isUsedOk : Boolean, 
        $typeId : Int, 
        $surveyId : Int
    ){
        updateQuestion(
            input : {
                turn : $turn,
                title : $title, 
                status : $status, 
                shouldBe : $shouldBe, 
                typeId : $typeId, 
                surveyId : $surveyId,
                isUsedOk : $isUsedOk
            }, 
            id : $id
        ){
            question {
                ...QuestionFragment
            }
            status
            errors{
                ...ErrorFragment
            }
        } 
    }
    ${QuestionFragments.question}
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
    mutation GetQuestions(
        $title : String, 
        $status : Boolean, 
        $shouldBe : Boolean, 
        $typeId : Int, 
        $surveyId : Int,
        $answerId : Int
        $page : Int,
        $limit : Int
    ){
        getQuestions(
            input : {
                title : $title, 
                status : $status, 
                shouldBe : $shouldBe, 
                typeId : $typeId, 
                surveyId : $surveyId,
                answerId : $answerId
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
                questions {
                    ...QuestionFragment
                }
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