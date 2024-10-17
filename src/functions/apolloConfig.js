import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"
import { onError } from "@apollo/client/link/error"
import { Auth } from "aws-amplify"

const cache = new InMemoryCache({
    addTypename: false,

})

async function GetCurrentSession() {
    try {
        return (await Auth.currentSession()).getIdToken().getJwtToken()
    } catch (error) { }
}

const awsGraphqlFetch = async (uri, options) => {
    const token = await GetCurrentSession()
    options.headers.Authorization = token
    return fetch(uri, options)
}

const httpLink = new HttpLink({
    uri: 'https://ewi6iwn4zfernbfps2b3ydppiy.appsync-api.eu-central-1.amazonaws.com/graphql',
    fetch: awsGraphqlFetch,
})

const defaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
}


const logout = () => {
    Auth.signOut()
        .then(() => {
        })
        .catch(() => { })
}

const logoutLink = onError(({ networkError, graphQLErrors }) => {
    console.log('Global network error', networkError, graphQLErrors)

    function IsUnauthorizedToken(error) {
        return error.errorType === 'UnauthorizedException' && (error.message === 'Valid authorization header not provided.' || error.message === 'Unable to parse JWT token.')
    }

    if (networkError && networkError.statusCode === 401 && IsUnauthorizedToken(graphQLErrors[0])) {
        //Token expired
        logout()
    }
})


const client = new ApolloClient({
    cache: cache,
    link: logoutLink.concat(httpLink),
    defaultOptions: defaultOptions,
})


export default client