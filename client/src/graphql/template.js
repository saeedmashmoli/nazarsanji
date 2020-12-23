import { gql } from '@apollo/client';
import { TemplateFragments, ErrorFragments, ParameterFragments } from './fragments'

export const getParametersForCreateAndUpdateTemplate = gql `
    query getParametersForCreateTemplate{
        getParametersForCreateTemplate{
            ...ParameterFragment
        }
    }
    ${ParameterFragments.parameter}
`;

export const createTemplateMutation = gql `
    mutation CreateTemplate(
        $title : String!, 
        $tempNumber : Int,
        $status : Boolean!,
        $link : String ,
        $parameters : [Int!],
    ){
        createTemplate(
            input : { 
                parameters : $parameters,
                title : $title, 
                status : $status,
                link : $link,
                tempNumber : $tempNumber
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
export const updateTemplateMutation = gql `
    mutation UpdateTemplate(
        $title : String, 
        $tempNumber : Int,
        $status : Boolean!,
        $link : String ,
        $parameters : [Int!],
        $id : Int!
    ){
        updateTemplate(
            input : { 
                title : $title, 
                status : $status,
                link : $link,
                tempNumber : $tempNumber,
                parameters : $parameters
            }
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
export const activeOrDeactiveTemplateMutation = gql `
    mutation activeOrDeactiveMutation($id : Int! , $status : Boolean!){
        activeOrDeactiveTemplate( id : $id , status : $status){
            status
            errors{
                ...ErrorFragment
            }
        }
    }
    ${ErrorFragments.error}
`
export const getTemplatesMutation = gql `
    mutation GetTemplates(
        $title : String, 
        $tempNumber : Int,
        $status : Boolean!,
        $link : String,
        $page: Int,
        $limit: Int
    ){
        getTemplates(
            input : {
                title : $title, 
                status : $status,
                link : $link,
                tempNumber : $tempNumber 
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
                templates {
                    ...TemplateFragment
                }
            }
        }
    }
    ${ErrorFragments.error}
    ${TemplateFragments.template}
`
export const getTemplateQuery = gql `
    query GetTemplate($id : Int!){
        getTemplate(id : $id){
            status
            errors {
                ...ErrorFragment
            }
            template {
                ...TemplateFragment
            }
        }
    }
    ${ErrorFragments.error}
    ${TemplateFragments.template}
`