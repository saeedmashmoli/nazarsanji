import { gql } from '@apollo/client';
import { SmsFragments, SurveyFragments, ErrorFragments, TemplateFragments, PackageFragments } from './fragments'

export const getOptionsForCreateSmsQuery = gql `
    query  getOptionsForCreateSms{
        getOptionsForCreateSms{
            status
            errors {
                ...ErrorFragment
            }
            packages {
                ...PackageFragment
            }
            templates {
                ...TemplateFragment
            }
            surveys {
                ...SurveyFragment
            }
           
        }
    }
    ${SurveyFragments.survey}
    ${TemplateFragments.template}
    ${PackageFragments.package}
    ${ErrorFragments.error}
`;


export const createSmsMutation = gql `
    mutation CreateSms(
        $packageId : Int, 
        $templateId : Int,
        $surveyId : Int
    ){
        createSms(
            input : { 
                packageId : $packageId,
                templateId : $templateId,
                surveyId : $surveyId
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
export const activeOrDeactiveSmsMutation = gql `
    mutation activeOrDeactiveMutation($id : Int! , $status : Boolean!){
        activeOrDeactiveSms( id : $id , status : $status){
            status
            errors{
                ...ErrorFragment
            }
        }
    }
    ${ErrorFragments.error}
`
export const getSendsMutation = gql `
    mutation GetSends(
        $name : String, 
        $phone : String, 
        $mobile : String,
        $customerId: Int,
        $packageId: Int,
        $templateId: Int,
        $callId: Int,
        $status : Boolean,
        $isSuccess : Boolean,
        $used : Boolean,
        $page: Int,
        $limit: Int
    ){
        getSends(
            input : {
                name : $name, 
                status : $status,
                phone : $phone,
                mobile : $mobile,
                customerId : $customerId,
                packageId : $packageId,
                templateId : $templateId,
                callId : $callId,
                isSuccess : $isSuccess,
                used : $used
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
                sends {
                    ...SmsFragment
                }
            }
        }
    }
    ${ErrorFragments.error}
    ${SmsFragments.sms}
`
export const getSmsQuery = gql `
    query GetSms($id : Int!){
        getSms(id : $id){
            status
            errors {
                ...ErrorFragment
            }
            send {
                ...SmsFragment
            }
        }
    }
    ${ErrorFragments.error}
    ${SmsFragments.sms}
`