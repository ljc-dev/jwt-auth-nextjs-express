import { useMutation } from '@apollo/react-hooks'
import Layout from '../components/Layout'
import { withApollo } from '../lib/apollo'
import { ADD_USER } from '../lib/schemas'
import useForm from '../lib/useForm'

const Register = () => {
    const [values, handleChange] = useForm({ username: "", password: "" })
    const [addUser, { loading, data, error }] = useMutation(ADD_USER)

    const handleRegister = (e) => {
        e.preventDefault()
        if (values.username === "" || values.password === "") return
        addUser({ variables: { username: values.username, password: values.password } })
            .then(console.log("mutation success"))
            .catch((err) => console.log("mutation failure:", err))
    }

    if (loading || !data)
        return (
            <Layout title={"Register"}>
                <h1>Register</h1>
                <form onSubmit={handleRegister}>
                    <label htmlFor="username">Username</label>
                    <input onChange={handleChange} type="text" name="username" id="usernameId" required />
                    <label htmlFor="password">Password</label>
                    <input onChange={handleChange} type="password" name="password" id="passwordId" required />
                    <button type="submit">Register</button>
                </form>
            </Layout>
        )

    console.log("register", data)
    return (
        <Layout title={"Register"}>
            <h1>Register</h1>
            <p className="errorMsg">
                {data.addUser.errorMsg && `Error message: ${data.addUser.errorMsg}`}
            </p>
            <form onSubmit={handleRegister}>
                <label htmlFor="username">Username</label>
                <input onChange={handleChange} type="text" name="username" id="usernameId" required />
                <label htmlFor="password">Password</label>
                <input onChange={handleChange} type="password" name="password" id="passwordId" required />
                <button type="submit">Register</button>
            </form>
        </Layout>
    )
}

export default withApollo({ ssr: true })(Register)