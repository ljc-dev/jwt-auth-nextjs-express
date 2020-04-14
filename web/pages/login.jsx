import useForm from '../lib/useForm'
import { useMutation } from '@apollo/react-hooks'
import { LOGIN } from '../lib/schemas'
import { withApollo } from '../lib/apollo'
import Layout from '../components/Layout'
import { setAccessToken } from '../lib/accessToken'

const Login = () => {
    const [values, handleChange] = useForm({ username: "", password: "" })
    const [loginUser, { loading, data, client }] = useMutation(LOGIN)

    const handleLogin = (e) => {
        e.preventDefault()
        if (values.username === "" || values.password === "") return
        loginUser({ variables: { username: values.username, password: values.password } })
            .then(() => {
                console.log("mutation success")
                client.resetStore()
            })
            .catch((err) => console.log("mutation failure:", err))
    }

    if (loading || !data)
        return (
            <Layout title={"Login"}>
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <label htmlFor="username">Username</label>
                    <input onChange={handleChange} type="text" name="username" id="usernameId" required />
                    <label htmlFor="password">Password</label>
                    <input onChange={handleChange} type="password" name="password" id="passwordId" required />
                    <button type="submit">Login</button>
                </form>

            </Layout>
        )
    console.log("login", data)
    setAccessToken(data.login.accessToken)
    console.log("accessToken", data.login.accessToken)
    return (
        <Layout title={"Login"}>
            <h1>Login</h1>
            <p className="errorMsg">
                {data.login.errorMsg && `Error message: ${data.login.errorMsg}`}
            </p>
            <form onSubmit={handleLogin}>
                <label htmlFor="username">Username</label>
                <input onChange={handleChange} type="text" name="username" id="usernameId" required />
                <label htmlFor="password">Password</label>
                <input onChange={handleChange} type="password" name="password" id="passwordId" required />
                <button type="submit">Login</button>
            </form>

        </Layout>
    )

}

export default withApollo({ ssr: true })(Login)