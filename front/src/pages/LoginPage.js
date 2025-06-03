import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);

    async function login(ev) {
        ev.preventDefault();
        const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (response.ok) {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
                setRedirect(true);
            });
        } else {
            alert("Wrong credentials");
        }
    }

    if (redirect) {
        return <Navigate to="/" />;
    }

    return (
        <div className="login-page-container">
            <div className="login-form-wrapper">
                <form className="login-form" onSubmit={login}>
                    <h1 className="login-title">Welcome Back!</h1>
                    <p className="login-subtitle">Sign in to manage your restaurant</p>
                    
                    <div className="login-input-group">
                        <label htmlFor="username" className="login-label">Username</label>
                        <input 
                            type="text"
                            id="username"
                            className="login-input"
                            placeholder="Enter your username"
                            value={username}
                            onChange={ev => setUsername(ev.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="login-input-group">
                        <label htmlFor="password" className="login-label">Password</label>
                        <input 
                            type="password"
                            id="password"
                            className="login-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={ev => setPassword(ev.target.value)}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="login-button">
                        Login
                    </button>
                    
                    <div className="login-footer">
                        <p>Don't have an account? <a href="/register" className="login-link">Register</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
}