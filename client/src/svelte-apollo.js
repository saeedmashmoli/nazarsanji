import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client'

const link = createUploadLink({
    uri: GRAPHQL_ENDPOINT,
    credentials: "include"
})

export default new ApolloClient({
    link,
    cache: new InMemoryCache(),

});