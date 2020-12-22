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
        $id : Int!
    ){
        updatePackage(
            input : { 
                title : $title, 
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
    mutation GetPackages($status : Boolean!){
        getPackages(status : $status) {
            status
            errors {
                ...ErrorFragment
            }
            packages {
                ...PackageFragment
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