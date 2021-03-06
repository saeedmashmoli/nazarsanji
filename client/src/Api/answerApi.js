import client from '../svelte-apollo';
import {
    updateAnswerMutation,
    createAnswerMutation,
    activeOrDeactiveAnswerMutation,
    getAnswerQuery,
    getAnswersMutation,
    getQuestionsForCreateAndUpdateAnswer
} from '../graphql/answer';

export const getQuestionsForCreateOrUpdateAnswerFn = async() => {
    const response = await client.query({
        query: getQuestionsForCreateAndUpdateAnswer
    })
    return response.data.getQuestionsForCreateAnswer
}
export const createOrUpdateAnswerFn = async(input, id = null) => {
    if (id) {
        const response = await client.mutate({
            mutation: updateAnswerMutation,
            variables: {
                ...input,
                id
            }
        })
        return response.data.updateAnswer;
    } else {
        const response = await client.mutate({
            mutation: createAnswerMutation,
            variables: {
                ...input
            }
        })
        return response.data.createAnswer;
    }
}
export const activeOrDeaciveAnswerFn = async(id, status) => {
    const response = await client.mutate({
        mutation: activeOrDeactiveAnswerMutation,
        variables: {
            id,
            status
        }
    })
    return response.data.activeOrDeactiveAnswer
}
export const getAnswersFn = async(input, page, limit) => {
    const response = await client.mutate({
        mutation: getAnswersMutation,
        variables: {
            ...input,
            page,
            limit
        }
    })
    return response.data.getAnswers
}


export const getAnswerFn = async(id) => {
    const response = await client.query({
        query: getAnswerQuery,
        variables: {
            id
        }
    })

    return response.data.getAnswer
}