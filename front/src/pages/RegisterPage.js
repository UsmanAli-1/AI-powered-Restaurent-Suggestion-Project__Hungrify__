import { useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function register(ev) {
    ev.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        alert("Registration successful");
        setUsername('');
        setPassword('');
      } else {
        const data = await response.json();
        alert(`Registration failed: ${data.message || data.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert("Error connecting to the server");
    }
  }

  return (
    <div className="login-page-container">
      <div className="login-form-wrapper">
        <form className="login-form" onSubmit={register}>
          <h1 className="login-title">Create Account</h1>
          <p className="login-subtitle">Join us to manage your restaurant</p>

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
            Register
          </button>

          <div className="login-footer">
            <p>Already have an account? <Link to="/login" className="login-link">Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}
