import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
let baseUrl = window.location.origin.split(":")[0] + ":" + window.location.origin.split(":")[1];
const link = createUploadLink({
    uri: (baseUrl === "http://khanemoshavere.com" ? "http://94.139.163.213" : baseUrl) + ":4000/graphql",
})
const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const accessToken = localStorage.getItem('access-token');
    const refreshToken = localStorage.getItem('refresh-token');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            accessToken: accessToken ? accessToken : "",
            refreshToken: refreshToken ? refreshToken : "",
        }
    }
});
// const link = createUploadLink({
//     uri: GRAPHQL_ENDPOINT,
//     credentials: "include"
// })

export default new ApolloClient({
    link: authLink.concat(link),
    cache: new InMemoryCache(),
});