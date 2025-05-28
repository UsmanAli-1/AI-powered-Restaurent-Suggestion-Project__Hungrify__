import { useState } from "react";

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
        credentials: 'include', // important if cookies will be used
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
    <form className="formPage" onSubmit={register}>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={ev => setUsername(ev.target.value)}
        required
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={ev => setPassword(ev.target.value)}
        required
      />
      <button>Register</button>
    </form>
  );
}
