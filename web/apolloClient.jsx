import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import fetch from 'isomorphic-unfetch'
import jwtDecode from 'jwt-decode'
import { ApolloLink } from 'apollo-link'
import { TokenRefreshLink } from 'apollo-link-token-refresh'
import { getAccessToken, setAccessToken } from './lib/accessToken'

export default function createApolloClient(initialState, ctx, serverAccessToken = null) {
    // The `ctx` (NextPageContext) will only be present on the server.
    // use it to extract auth headers (ctx.req) or similar.
    const httpLink = new HttpLink({
        uri: "http://localhost:4000/graphql",
        credentials: "include",
        fetch
    })

    const refreshLink = new TokenRefreshLink({
        accessTokenField: "accessToken",
        isTokenValidOrUndefined: () => {
            const token = getAccessToken()

            if (!token) {
                return true
            }

            try {
                const { exp } = jwtDecode(token)
                if (Date.now() >= exp * 1000) {
                    return false
                } else {
                    return true
                }
            } catch {
                return false
            }
        },
        fetchAccessToken: () => {
            return fetch("http://localhost:4000/refresh-token", {
                method: "POST",
                credentials: "include"
            })
        },
        handleFetch: accessToken => {
            setAccessToken(accessToken)
        },
        handleError: err => {
            console.warn("Your refresh token is invalid. Try to relogin")
            console.error(err);
        }
    })

    const authLink = setContext((_request, { headers }) => {
        const token = typeof window === "undefined" ? serverAccessToken : getAccessToken()
        return {
            headers: {
                ...headers,
                authorization: token ? `bearer ${token}` : ""
            }
        }
    })

    const errorLink = onError(({ graphQLErrors, networkError }) => {
        console.log(graphQLErrors)
        console.log(networkError)
    })
    return new ApolloClient({
        ssrMode: Boolean(ctx),
        link: ApolloLink.from([refreshLink, authLink, errorLink, httpLink]),
        cache: new InMemoryCache().restore(initialState),
    })
}