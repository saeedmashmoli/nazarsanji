import client from '../svelte-apollo';
import {
    createQuestionMutation,
    updateQuestionMutation,
    activeOrDeactiveQuestionMutation,
    getQuestionsMutation,
    getQuestionQuery,
    getSurveysAndTypesForCreateQuestion
} from '../graphql/question';
export const getSurveysAndTypesForCreateOrUpdateQuestionFn = async() => {
    const response = await client.query({
        query: getSurveysAndTypesForCreateQuestion
    })
    return response.data.getSurveysAndTypesForCreateQuestion
}
export const createOrUpdateQuestionFn = async(input, id = null) => {
    if (id) {
        const response = await client.mutate({
            mutation: updateQuestionMutation,
            variables: {
                ...input,
                id
            }
        })
        return response.data.updateQuestion;
    } else {
        const response = await client.mutate({
            mutation: createQuestionMutation,
            variables: {
                ...input
            }
        })
        return response.data.createQuestion;
    }
}
export const activeOrDeaciveQuestionFn = async(id, status) => {

    const response = await client.mutate({
        mutation: activeOrDeactiveQuestionMutation,
        variables: {
            id,
            status
        }
    })
    return response.data.activeOrDeactiveQuestion
}
export const getQuestionsFn = async(input, page, limit) => {
    const response = await client.mutate({
        mutation: getQuestionsMutation,
        variables: {
            ...input,
            page,
            limit
        }
    })
    return response.data.getQuestions
}
export const getQuestionFn = async(id) => {
    const response = await client.query({
        query: getQuestionQuery,
        variables: {
            id
        }
    })

    return response.data.getQuestion
}