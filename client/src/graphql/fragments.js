import { gql } from '@apollo/client';
export const ErrorFragments = {
    error: gql `
        fragment ErrorFragment on FieldError {
            field
            message
        }
    `
};
export const PermissionFragments = {
    permission: gql `
        fragment PermissionFragment on Permission {
            id
            label
            title
            model
            status
            roles {
               title
               label
               status
            }
        }  
    `
}
export const RoleFragments = {
    role: gql `
        fragment RoleFragment on Role {
            id
            label
            title
            status
            permissions {
                ...PermissionFragment
            }
        }
        ${PermissionFragments.permission}   
    `
}
export const TypeFragments = {
    type: gql `
        fragment TypeFragment on Type {
            id
            title
        }
  `
};


export const UserFragment = {
    user: gql `
        fragment UserFragment on User {
            id
            name
            mobile
            email
            active
            role { 
                ...RoleFragment
            }
        }
        ${RoleFragments.role}
    `
};
export const SurveyFragments = {
    survey: gql `
        fragment SurveyFragment on Survey {
            id
            title
            status
        }
  `
};


export const QuestionFragments = {
    question: gql `
        fragment QuestionFragment on Question {
            id
            title
            status
            typeId
            type {
                ...TypeFragment
            }
            shouldBe
            surveyId
            survey {
                ...SurveyFragment
            }
        }
        ${TypeFragments.type}
        ${SurveyFragments.survey}
  `
};




export const AnswerFragments = {
    answer: gql `
        fragment AnswerFragment on Answer {
            id
            title
            status
            questionId
            question {
                title
                shouldBe
            }
            image
            link
            flag
            percent
        }
    `
};
export const CallFragments = {
    call: gql `
        fragment CallFragment on Call {
            id
            issue
            minorIssue
            exactIssue
            callTime
            callCode
            callPrice
            price
            operatorCallTime
            operatorDelayTime
            moshaverCallTime
            moshaverDelayTime
            month
            year
            status
            customerId
            customer {
                name
                mobile
                phone
                status
            }
            packageId
            package {
                title
                status
            }
        }
    `
};
export const CustomerFragments = {
    customer: gql `
        fragment CustomerFragment on Customer {
            id
            name
            mobile
            phone
            status
        }
    `
};
export const PackageFragments = {
    package: gql `
        fragment PackageFragment on Package {
            id
            title
            status
        }
    `
};