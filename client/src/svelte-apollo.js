import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
const baseUrl = window.location.origin.split(":")[0] + ":" + window.location.origin.split(":")[1];
const link = createUploadLink({
        uri: baseUrl + ":4000/graphql",
        credentials: "include"
    })
    // const link = createUploadLink({
    //     uri: GRAPHQL_ENDPOINT,
    //     credentials: "include"
    // })

export default new ApolloClient({
    link,
    cache: new InMemoryCache(),

});