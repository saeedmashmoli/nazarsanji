import { gql } from '@apollo/client';
import { PackageFragments, ErrorFragments } from './fragments'

export const createPackageMutation = gql `
    mutation CreatePackage(
        $title : String!, 
        $status : Boolean!,
        $file : Upload 
    ){
        createPackage(
            input : { 
                title : $title, 
                status : $status 
            }
            file : $file
        ){
            status
            errors{
                ...ErrorFragment
            }
        } 
    }
    ${ErrorFragments.error}
`
export const updatePackageMutation = gql `
    mutation UpdatePackage(
        $title : String!, 
        $status : Boolean!,
        $file : Upload, 
        $id : Int!
    ){
        updatePackage(
            input : { 
                title : $title, 
                status : $status
            }, 
            id : $id
            file : $file
        ){
            status
            errors{
                ...ErrorFragment
            }
        } 
    }
    ${ErrorFragments.error}
`
export const activeOrDeactivePackageMutation = gql `
    mutation activeOrDeactiveMutation($id : Int! , $status : Boolean!){
        activeOrDeactivePackage( id : $id , status : $status){
            status
            errors{
                ...ErrorFragment
            }
        }
    }
    ${ErrorFragments.error}
`
export const getPackagesMutation = gql `
    mutation GetPackages(
        $status : Boolean,
        $callId : Int,
        $title : String, 
        $page : Int,
        $limit : Int
    ){
        getPackages(
            input : {
                status : $status,
                title : $title, 
                callId : $callId
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
                packages {
                    ...PackageFragment
                }
            }
        }
    }
    ${ErrorFragments.error}
    ${PackageFragments.package}
`
export const getPackageQuery = gql `
    query GetPackage($id : Int!){
        getPackage(id : $id){
            status
            errors {
                ...ErrorFragment
            }
            package {
                ...PackageFragment
            }
        }
    }
    ${ErrorFragments.error}
    ${PackageFragments.package}
`