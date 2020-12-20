import { gql } from '@apollo/client';
import { CallFragments, ErrorFragments } from './fragments'

export const createCallMutation = gql `
    mutation CreateCall(
        $issue : String,
        $minorIssue : String,
        $exactIssue : String,
        $callTime : Int,
        $callCode : String,
        $callPrice : Int,
        $price : Int,
        $operatorCallTime : Int,
        $operatorDelayTime : Int,
        $moshaverCallTime : Int,
        $moshaverDelayTime : Int,
        $month : String,
        $year : String,
        $customerId : Int,
        $packageId :  Int
    ){
        createCall(
            input : {
                issue : $issue, 
                minorIssue : $minorIssue, 
                exactIssue : $exactIssue, 
                callTime : $callTime, 
                callCode : $callCode,
                callPrice : $callPrice, 
                price : $price, 
                operatorCallTime : $operatorCallTime, 
                operatorDelayTime : $operatorDelayTime,
                moshaverCallTime : $moshaverCallTime, 
                moshaverDelayTime : $moshaverDelayTime, 
                month : $month, 
                year : $year,
                customerId : $customerId,
                packageId : $packageId
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
export const updateCallMutation = gql `
    mutation UpdateCall(
        $id : Int!, 
        $issue : String,
        $minorIssue : String,
        $exactIssue : String,
        $callTime : Int,
        $callCode : String,
        $callPrice : Int,
        $price : Int,
        $operatorCallTime : Int,
        $operatorDelayTime : Int,
        $moshaverCallTime : Int,
        $moshaverDelayTime : Int,
        $month : String,
        $year : String,
        $customerId : Int,
        $packageId :  Int
    ){
        updateCall(
            input : {
                issue : $issue, 
                minorIssue : $minorIssue, 
                exactIssue : $exactIssue, 
                callTime : $callTime, 
                callCode : $callCode,
                callPrice : $callPrice, 
                price : $price, 
                operatorCallTime : $operatorCallTime, 
                operatorDelayTime : $operatorDelayTime,
                moshaverCallTime : $moshaverCallTime, 
                moshaverDelayTime : $moshaverDelayTime, 
                month : $month, 
                year : $year,
                customerId : $customerId,
                packageId : $packageId
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
export const activeOrDeactiveCallMutation = gql `
    mutation activeOrDeactiveMutation($id : Int! , $status: Boolean!){
        activeOrDeactiveCall(id : $id , status : $status){
            status
            errors{
                ...ErrorFragment
            }
        }
    }
    ${ErrorFragments.error}
`
export const getCallsMutation = gql `
    mutation GetCalls($status : Boolean!){
        getCalls(status : $status) {
            status
            errors {
                ...ErrorFragment
            }
            calls {
                ...CallFragment
            }
        }
    }
    ${ErrorFragments.error}
    ${CallFragments.call}
`
export const getCallQuery = gql `
    query GetCall($id : Int!){
        getCall(id : $id){
            status
            errors {
                ...ErrorFragment
            }
            call {
                ...CallFragment
            }
        }
    }
    ${ErrorFragments.error}
    ${CallFragments.call}
`