import { useMutation } from '@apollo/react-hooks'
import Layout from '../components/Layout'
import { setAccessToken } from '../lib/accessToken'
import { withApollo } from '../lib/apollo'
import { LOGOUT } from '../lib/schemas'

const Logout = () => {
    const [logoutUser, { loading, data, client }] = useMutation(LOGOUT)

    const handleLogout = (e) => {
        e.preventDefault()
        logoutUser({ variables: {} })
            .then(() => {
                console.log("mutation success")
                client.resetStore()
            })
            .catch((err) => console.log("mutation failure:", err))
    }

    if (loading || !data)
        return (
            <Layout title={"Logout"}>
                <h1>Logout</h1>
                <button onClick={handleLogout} >Logout</button>
            </Layout>
        )
    console.log("logout", data)
    setAccessToken("")
    if (!data.logout.hasLogout) {
        return (
            <Layout title={"Logout"}>
                <h1>Logout</h1>
                <p>Logout mutation failed </p>
                <button onClick={handleLogout} >Logout</button>
            </Layout>
        )
    }
    return (
        <Layout title={"Logout"}>
            <h1>Logout</h1>
            <p>Logout successful!</p>
        </Layout>
    )

}

export default withApollo({ ssr: true })(Logout)