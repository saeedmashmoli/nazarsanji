import client from '../svelte-apollo';


import { getLogsMutation, getUsersAndModelsForShowLogsQuery } from "../graphql/log";

export const getModelsAndUsersForShowLogFn = async() => {
    const response = await client.query({
        query: getUsersAndModelsForShowLogsQuery
    })

    return response.data.getUsersAndModelsForShowLogs
}

export const getLogsFn = async(input, page, limit) => {
    const response = await client.mutate({
        mutation: getLogsMutation,
        variables: {
            ...input,
            page,
            limit
        }
    })
    return response.data.getLogs
}