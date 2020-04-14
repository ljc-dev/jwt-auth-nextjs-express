import Link from 'next/link'
import { getAccessToken } from '../lib/accessToken'

const Header = () => {
    const isLoggedIn = getAccessToken()
    return (
        <div className="Header">
            <div className="isLoggedIn">{isLoggedIn ? "Logged in!!!" : "Not logged in..."}</div>
            <Link href="/">
                <a>Home</a>
            </Link>
            <Link href="/login">
                <a>Login</a>
            </Link>
            <Link href="/register">
                <a>Register</a>
            </Link>
            <Link href="/profile">
                <a>Profile</a>
            </Link>
            <Link href="/logout">
                <a>Logout</a>
            </Link>
            <style jsx>{`
                header {
                    margin-bottom: 25px;
                }
                a {
                    font-size: 14px;
                    margin-right: 15px;
                    text-decoration: none;
                }
                .is-active {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
}

export default Header;