import { gql } from '@apollo/client';
import { ParameterFragments, ErrorFragments } from './fragments'

export const createParameterMutation = gql `
    mutation CreateParameter(
        $title : String, 
        $status : Boolean,
        $label : String! 
    ){
        createParameter(
            input : { 
                title : $title, 
                status : $status,
                label : $label
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
export const updateParameterMutation = gql `
    mutation UpdateParameter(
        $title : String, 
        $status : Boolean,
        $label : String, 
        $id : Int!
    ){
        updateParameter(
            input : { 
                title : $title, 
                status : $status,
                label : $label
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
export const activeOrDeactiveParameterMutation = gql `
    mutation activeOrDeactiveMutation($id : Int! , $status : Boolean!){
        activeOrDeactiveParameter( id : $id , status : $status){
            status
            errors{
                ...ErrorFragment
            }
        }
    }
    ${ErrorFragments.error}
`
export const getParametersMutation = gql `
    mutation GetParameters(
        $status : Boolean!, 
        $title : String, 
        $label : String, 
        $page: Int,
        $limit: Int
    ){
        getParameters(
            input : {
                status : $status, 
                title : $title, 
                label : $label, 
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
                parameters {
                    ...ParameterFragment
                }
            }
        }
    }
    ${ErrorFragments.error}
    ${ParameterFragments.parameter}
`
export const getParameterQuery = gql `
    query GetParameter($id : Int!){
        getParameter(id : $id){
            status
            errors {
                ...ErrorFragment
            }
            parameter {
                ...ParameterFragment
            }
        }
    }
    ${ErrorFragments.error}
    ${ParameterFragments.parameter}
`