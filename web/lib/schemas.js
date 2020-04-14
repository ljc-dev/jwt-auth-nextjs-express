import gql from 'graphql-tag'

export const GET_USER = gql`
    {
        getUser {
            user {
                id
                username
                password
                tokenVersion
            }
            errorMsg
        }
    }
`

export const ADD_USER = gql`
    mutation AddUser($username: String!, $password: String!) {
        addUser(username: $username, password: $password) {
            user {
                id
                username
                password
                tokenVersion
            }
            errorMsg
        }
    }
`

export const LOGIN = gql`
    mutation LoginUser($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            accessToken
            user {
                id
                username
                password
                tokenVersion
            }
            errorMsg
        }
    }
`

export const LOGOUT = gql`
    mutation LogoutUser {
        logout {
            hasLogout
        }
    }
`

