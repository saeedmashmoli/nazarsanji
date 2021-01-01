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
export const CriteriaFragments = {
    criteria: gql `
        fragment CriteriaFragment on Criteria {
            id
            symbol
            title
            status
        }
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
export const ConditionFragments = {
    condition: gql `
        fragment ConditionFragment on Condition {
            id
            status
            consQuestionId
            consQuestion{
                title
                id
                survey {
                    ...SurveyFragment
                }
            }
            questionId
            question {
                title 
            }
            answerId
            answer {
                ...AnswerFragment
            }
            criteriaId
            criteria {
                ...CriteriaFragment
            }
        }
        ${SurveyFragments.survey}
        ${AnswerFragments.answer}
        ${CriteriaFragments.criteria}
    `
};
export const QuestionFragments = {
    question: gql `
        fragment QuestionFragment on Question {
            id
            title
            turn
            status
            typeId
            type {
                ...TypeFragment
            }
            shouldBe
            isUsedOk
            surveyId
            survey {
                ...SurveyFragment
            }
            answers {
                ...AnswerFragment
            }
            conditions {
                ...ConditionFragment
            }
        }
        ${AnswerFragments.answer}
        ${ConditionFragments.condition}
        ${TypeFragments.type}
        ${SurveyFragments.survey}
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
                ...CustomerFragment
            }
            packages {
                ...PackageFragment
            }
        }
        ${PackageFragments.package}
        ${CustomerFragments.customer}
    `
};


export const ParameterFragments = {
    parameter: gql `
        fragment ParameterFragment on Parameter {
            id
            label
            title
            status
        }
    `
};
export const TemplateFragments = {
    template: gql `
        fragment TemplateFragment on Template {
            id
            title
            body
            isDynamicLink
            tempNumber
            link
            status
            parameters
        }
    `
};
export const SmsFragments = {
    sms: gql `
        fragment SmsFragment on Sms {
            id
            token
            isSuccess
            used
            message
            status
            createdAt
            survey {
                ...SurveyFragment
            }
            template {
                ...TemplateFragment
            }
            call {
                ...CallFragment
            }
        }
        ${SurveyFragments.survey}
        ${TemplateFragments.template}
        ${CallFragments.call}
    `
};

export const LogFragments = {
    log: gql `
        fragment LogFragment on Log {
            id
            operation
            data
            rowId
            modelId
            model {
                id
                label
                title
            }
            userId
            user {
                ...UserFragment
            }
            createdAt
        }
        ${UserFragment.user}
    `
};



export const CommentFragments = {
    comment: gql `
        fragment CommentFragment on Comment {
            id
            smsId
            questionId
            question {
                ...QuestionFragment
            }
            answerId
            answer {
                ...AnswerFragment
            }
            text
            status
            createdAt
        }
        ${AnswerFragments.answer}
        ${QuestionFragments.question}
    `
};