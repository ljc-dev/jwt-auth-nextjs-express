import Layout from "../components/Layout"
import { withApollo } from "../lib/apollo"
import { useQuery } from '@apollo/react-hooks'
import { GET_USER } from '../lib/schemas'
import { getAccessToken } from '../lib/accessToken'

const Profile = () => {
    const { loading, error, data } = useQuery(GET_USER)
    if (loading || !data)
        return (
            <Layout title={"Profile"}>
                <h1>Profile</h1>
                <p>Loading...</p>
            </Layout>
        )
    console.log("get access token", getAccessToken())
    if (data.getUser && data.getUser.user) {
        const { username, password, tokenVersion, id } = data.getUser.user
        const { errorMsg } = data.getUser
        return (
            <Layout title={"Profile"}>
                <h1>Profile</h1>
                <p>{errorMsg && `Error getting data: ${errorMsg}`}</p>
                <p>Id: {id}</p>
                <p>Username: {username}</p>
                <p>Password: {password}</p>
                <p>TokenVersion: {tokenVersion}</p>
            </Layout>
        )
    } else {
        return (
            <Layout title={"Profile"}>
                <h1>Profile</h1>
                <p>{`Error getting data`}</p>
            </Layout>)
    }

}

export default withApollo({ ssr: true })(Profile)