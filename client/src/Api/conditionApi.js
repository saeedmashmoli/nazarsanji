import client from '../svelte-apollo';
import {
    createConditionMutation,
    activeOrDeactiveConditionMutation,
    updateConditionMutation,
    getConditionMutation,
    getAnswersForCreateAndUpdateConditionQuery,
    getQuestionsForCreateAndUpdateConditionQuery,
    getOptionsForCreateAndUpdateConditionQuery,
    getConditionsMutation
} from '../graphql/condition';
export const getOptionsForCreateConditionFn = async() => {
    const response = await client.query({
        query: getOptionsForCreateAndUpdateConditionQuery
    })
    return response.data.getOptionsForCreateAndUpdateCondition
}
export const getQuestionsForCreateConditionFn = async(surveyId) => {
    const response = await client.query({
        query: getQuestionsForCreateAndUpdateConditionQuery,
        variables: {
            surveyId
        }
    })
    return response.data.getQuestionsForCreateAndUpdateCondition
}
export const getAnswersForCreateConditionFn = async(questionId) => {
    const response = await client.query({
        query: getAnswersForCreateAndUpdateConditionQuery,
        variables: {
            questionId
        }
    })
    return response.data.getAnswersForCreateAndUpdateCondition
}

export const getConditionsFn = async(input, page, limit) => {
    const response = await client.mutate({
        mutation: getConditionsMutation,
        variables: {
            ...input,
            page,
            limit
        }
    })
    return response.data.getConditions
}
export const getConditionFn = async(id) => {
    const response = await client.mutate({
        mutation: getConditionMutation,
        variables: {
            id
        }
    })

    return response.data.getCondition
}
export const createConditionFn = async(input, id = null) => {
    if (id) {
        const response = await client.mutate({
            mutation: updateConditionMutation,
            variables: {
                ...input,
                id
            }
        })
        return response.data.updateCondition;
    } else {
        const response = await client.mutate({
            mutation: createConditionMutation,
            variables: {
                ...input
            }
        })
        return response.data.createCondition;
    }
}

export const activeOrDeaciveConditionFn = async(id, status) => {

    const response = await client.mutate({
        mutation: activeOrDeactiveConditionMutation,
        variables: {
            id,
            status
        }
    })
    return response.data.activeOrDeactiveCondition
}