import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client'

const link = createUploadLink({
    uri: 'http://localhost:4000/graphql',
    credentials: "include"
})

export default new ApolloClient({
    link,
    cache: new InMemoryCache(),

});