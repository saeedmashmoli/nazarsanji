import client from '../svelte-apollo';
import {
    getOptionsForCreateAndUpdateCommentQuery,
    createCommentMutation,
    getCommentsMutation,
    updateCommentMutation,
    activeOrDeactiveCommentMutation

} from '../graphql/comment';
export const getOptionsFn = async(token) => {
    const response = await client.query({
        query: getOptionsForCreateAndUpdateCommentQuery,
        variables: {
            token
        }
    })
    return response.data.getOptionsForCreateComment
}
export const getCommentsFn = async(input, page, limit) => {
    const response = await client.mutate({
        mutation: getCommentsMutation,
        variables: {
            ...input,
            page,
            limit
        }
    })
    return response.data.getComments
}
export const getCommentFn = async(id) => {
    const response = await client.query({
        query: getCommentQuery,
        variables: {
            id
        }
    })

    return response.data.getComment
}
export const createCommentFn = async(input, id = null) => {
    if (id) {
        const response = await client.mutate({
            mutation: updateCommentMutation,
            variables: {
                ...input,
                id
            }
        })
        return response.data.updateComment;
    } else {
        const response = await client.mutate({
            mutation: createCommentMutation,
            variables: {
                ...input
            }
        })
        return response.data.createComment;
    }
}

export const activeOrDeaciveCommentFn = async(id, status) => {

    const response = await client.mutate({
        mutation: activeOrDeactiveCommentMutation,
        variables: {
            id,
            status
        }
    })
    return response.data.activeOrDeactiveComment
}