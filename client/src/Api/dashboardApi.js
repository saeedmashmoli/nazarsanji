import client from '../svelte-apollo';
import {
    getDashboardDataQuery
} from '../graphql/dashboard';
export const getDataForDashboardFn = async() => {
    const response = await client.query({
        query: getDashboardDataQuery,
    })
    return response.data.getDataForDashboard
}