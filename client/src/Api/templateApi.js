import client from '../svelte-apollo';
import {
    createTemplateMutation,
    updateTemplateMutation,
    activeOrDeactiveTemplateMutation,
    getTemplatesMutation,
    getTemplateQuery,
    getParametersForCreateAndUpdateTemplate
} from '../graphql/template';
export const createOrUpdateTemplateFn = async(input, id = null) => {
    console.log(input.parameters)
    if (id) {
        const response = await client.mutate({
            mutation: updateTemplateMutation,
            variables: {
                ...input,
                id
            }
        })
        return response.data.updateTemplate;
    } else {
        const response = await client.mutate({
            mutation: createTemplateMutation,
            variables: {
                ...input
            }
        })
        return response.data.createTemplate;
    }
}
export const activeOrDeaciveTemplateFn = async(id, status) => {

    const response = await client.mutate({
        mutation: activeOrDeactiveTemplateMutation,
        variables: {
            id,
            status
        }
    })
    return response.data.activeOrDeactiveTemplate
}
export const getParametersForCreateOrUpdateTemplateFn = async() => {
    const response = await client.query({
        query: getParametersForCreateAndUpdateTemplate
    })
    return response.data.getParametersForCreateTemplate
}
export const getTemplatesFn = async(input, page, limit) => {
    const response = await client.mutate({
        mutation: getTemplatesMutation,
        variables: {
            ...input,
            page,
            limit
        }
    })
    return response.data.getTemplates
}
export const getTemplateFn = async(id) => {
    const response = await client.query({
        query: getTemplateQuery,
        variables: {
            id
        }
    })

    return response.data.getTemplate
}