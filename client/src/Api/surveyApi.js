import client from '../svelte-apollo';
import {
    createSurveyMutation,
    updateSurveyMutation,
    activeOrDeactiveSurveyMutation,
    getSurveysMutation,
    getSurveyQuery
} from '../graphql/survey';
export const createOrUpdateSurveyFn = async(input, id = null) => {
    if (id) {
        const response = await client.mutate({
            mutation: updateSurveyMutation,
            variables: {
                ...input,
                id
            }
        })
        return response.data.updateSurvey;
    } else {
        const response = await client.mutate({
            mutation: createSurveyMutation,
            variables: {
                ...input
            }
        })
        return response.data.createSurvey;
    }
}
export const activeOrDeaciveSurveyFn = async(id, status) => {

    const response = await client.mutate({
        mutation: activeOrDeactiveSurveyMutation,
        variables: {
            id,
            status
        }
    })
    return response.data.activeOrDeactiveSurvey
}
export const getSurveysFn = async(input, page, limit) => {
    const response = await client.mutate({
        mutation: getSurveysMutation,
        variables: {
            ...input,
            page,
            limit
        }
    })
    return response.data.getSurveys
}
export const getSurveyFn = async(id) => {
    const response = await client.query({
        query: getSurveyQuery,
        variables: {
            id
        }
    })

    return response.data.getSurvey
}