import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../components/Auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handle = async (e: any) => {
    e.preventDefault();
    try {
      const res = await login({ username, password });
      setToken(res.token);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container max-w-md mx-auto py-8">
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={handle}>
          <div className="mb-3">
            <label htmlFor="login-username" className="label">Username</label>
            <input id="login-username" className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="login-password" className="label">Password</label>
            <input id="login-password" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="text-right">
            <button className="btn btn-primary" type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}
