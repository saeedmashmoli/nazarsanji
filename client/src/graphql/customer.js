import { gql } from '@apollo/client';
import { CustomerFragments, ErrorFragments } from './fragments'

export const createCustomerMutation = gql `
    mutation CreateCustomer(
        $name : String, 
        $status : Boolean!, 
        $mobile : String, 
        $phone : String 
    ){
        createCustomer(
            input : {
                name : $name , 
                status : $status , 
                mobile : $mobile , 
                phone : $phone
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
export const updateCustomerMutation = gql `
    mutation UpdateCustomer(
        $name : String, 
        $status : Boolean!, 
        $mobile : String, 
        $phone : String, 
        $id : Int!
    ){
        updateCustomer(
            input : {
                name : $name, 
                status : $status, 
                mobile : $mobile,
                phone : $phone
            } , 
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
export const activeOrDeactiveCustomerMutation = gql `
    mutation activeOrDeactiveMutation($id : Int! , $status : Boolean!){
        activeOrDeactiveCustomer(id : $id , status : $status){
            status
            errors{
                ...ErrorFragment
            }
        }
    }
    ${ErrorFragments.error}
`
export const getCustomersMutation = gql `
    mutation GetCustomers($status : Boolean!){
        getCustomers(status : $status) {
            status
            errors {
                ...ErrorFragment
            }
            customers {
                ...CustomerFragment
            }
        }
    }
    ${ErrorFragments.error}
    ${CustomerFragments.customer}
`
export const getCustomerQuery = gql `
    query GetCustomer($id : Int!){
        getCustomer(id : $id){
            status
            errors {
                ...ErrorFragment
            }
            customer {
                ...CustomerFragment
            }
        }
    }
    ${ErrorFragments.error}
    ${CustomerFragments.customer}
`