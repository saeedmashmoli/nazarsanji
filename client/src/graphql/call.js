import { gql } from '@apollo/client';
import { CallFragments, ErrorFragments, PackageFragments } from './fragments'

export const createCallMutation = gql `
    mutation CreateCall(
        $beginDate : String,
        $endDate : String,
        $beginTime : String,
        $endTime : String,
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
        $packageIds : [Int!],
        $status : Boolean!  
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
                beginDate : $beginDate,
                endDate : $endDate,
                beginTime : $beginTime,
                endTime : $endTime,
                status : $status
            },
            packageIds : $packageIds
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
        $packageIds : [Int!],
        $status : Boolean!
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
                status : $status
            }, 
            id : $id,
            packageIds : $packageIds
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
    mutation GetCalls(
        $beginDate : String,
        $endDate : String,
        $beginTime : String,
        $endTime : String,
        $status : Boolean, 
        $name : String, 
        $phone : String, 
        $mobile : String,
        $issue : String, 
        $minorIssue : String, 
        $exactIssue : String,
        $callCode : String, 
        $year : String, 
        $month : String,
        $page: Int,
        $limit: Int 
    ){
        getCalls(
            input : {
                status : $status, 
                name : $name, 
                phone : $phone, 
                mobile : $mobile,
                issue : $issue, 
                minorIssue : $minorIssue, 
                exactIssue : $exactIssue
                callCode : $callCode, 
                year : $year, 
                month : $month,
                beginDate : $beginDate,
                endDate : $endDate,
                beginTime : $beginTime,
                endTime : $endTime
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
                calls {
                    ...CallFragment
                }
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
export const getOptionsForCreateAndUpdateCallQuery = gql `
    query GetOptions {
        getOptionsForCreateAndUpdateCall{
            ...PackageFragment
        }
    }
    ${PackageFragments.package}
`