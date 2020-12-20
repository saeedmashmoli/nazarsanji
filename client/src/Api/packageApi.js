import client from '../svelte-apollo';
import {
    createPackageMutation,
    updatePackageMutation,
    activeOrDeactivePackageMutation,
    getPackagesMutation,
    getPackageQuery
} from '../graphql/package';
export const createOrUpdatePackageFn = async(input, id = null) => {
    if (id) {
        const response = await client.mutate({
            mutation: updatePackageMutation,
            variables: {
                ...input,
                id
            }
        })
        return response.data.updatePackage;
    } else {
        const response = await client.mutate({
            mutation: createPackageMutation,
            variables: {
                ...input
            }
        })
        return response.data.createPackage;
    }
}
export const activeOrDeacivePackageFn = async(id, status) => {

    const response = await client.mutate({
        mutation: activeOrDeactivePackageMutation,
        variables: {
            id,
            status
        }
    })
    return response.data.activeOrDeactivePackage
}
export const getPackagesFn = async(status) => {
    const response = await client.mutate({
        mutation: getPackagesMutation,
        variables: {
            status
        }
    })
    return response.data.getPackages
}
export const getPackageFn = async(id) => {
    const response = await client.query({
        query: getPackageQuery,
        variables: {
            id
        }
    })

    return response.data.getPackage
}