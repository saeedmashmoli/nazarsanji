import { gql } from '@apollo/client';

export const UserFragment = {
    user: gql `
        fragment UserFragment on User {
            name
            mobile
            email
            role { 
                title
                label
                id
                permissions {
                    title
                    label
                    model
                }
            }
        }
    `
};

export const ErrorFragments = {
    error: gql `
        fragment ErrorFragment on FieldError {
            field
            message
        }
    `
};
export const QuestionFragments = {
    question: gql `
        fragment QustionFragment on Question {
            id
            title
            status
            typeId
            type {
                title
            }
            shouldBe
            surveyId
            survey {
                title
            }
        }
  `
};
export const SurveyFragments = {
    survey: gql `
        fragment SueveyFragment on Survey {
            id
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