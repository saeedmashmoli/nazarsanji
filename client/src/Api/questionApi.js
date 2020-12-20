import client from '../svelte-apollo';
import {
    createQuestionMutation,
    updateQuestionMutation,
    activeOrDeactiveQuestionMutation,
    getQuestionsMutation,
    getQuestionQuery,
    getTypesQuery
} from '../graphql/question';
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
export const getQuestionsFn = async(status) => {
    const response = await client.mutate({
        mutation: getQuestionsMutation,
        variables: {
            status
        }
    })
    return response.data.getQuestions
}
export const getTypesFn = async() => {
    const response = await client.query({
        query: getTypesQuery
    })
    return response.data.getTypes
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