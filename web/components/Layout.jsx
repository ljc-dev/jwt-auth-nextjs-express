import Head from "next/head"
import Header from "./Header"
const Layout = ({ children, title = "default title" }) => {
    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Header />
            <main>
                {children}
                <style jsx global>{`
                * {
                    font-family: Menlo, Monaco, 'Lucida Console', 'Liberation Mono',
                    'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Courier New',
                    monospace, serif;
                }
                body {
                    margin: 0;
                    padding: 25px 50px;
                    background: #000;
                    color: #fff;
                }
                input {
                    background: #ccc;
                }
                a {
                    display: inline-block;
                    padding: 0.5rem 0 ;
                    margin-top: 0.5rem;
                    color: #fff;
                }
                a:focus, a:hover {
                    text-decoration: underline;
                    outline: none;
                }

                `}</style>
            </main>
        </div>
    );
}

export default Layout;