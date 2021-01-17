import client from '../svelte-apollo';
import {
    getCommentReportDataMutation,
    getSurveysForReportsQuery
} from '../graphql/report';
export const getSurveysForReportsFn = async() => {
    const response = await client.query({
        query: getSurveysForReportsQuery
    })
    return response.data.getSurveysForReports;
}
export const getDataForCommentReportFn = async(input) => {
    const response = await client.query({
        query: getCommentReportDataMutation,
        variables: {
            ...input
        }
    })
    return response.data.getDataForCommentReport
}