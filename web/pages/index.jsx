import Layout from "../components/Layout"
import { withApollo } from "../lib/apollo"

const Index = () => {
    return (
        <Layout title={"Welcome"}>
            <h1>Hello</h1>
        </Layout>
    )
}

export default withApollo({ ssr: true })(Index)