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
export const activeOrDeaciveSurveyFn = async(id) => {

    const response = await client.mutate({
        mutation: activeOrDeactiveSurveyMutation,
        variables: {
            id
        }
    })
    return response.data.activeOrDeactiveSurvey
}
export const getSurveysFn = async(status) => {
    const response = await client.mutate({
        mutation: getSurveysMutation,
        variables: {
            status
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