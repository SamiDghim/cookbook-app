import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';
import { useAuth } from '../components/Auth';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handle = async (e: any) => {
    e.preventDefault();
    try {
      const res = await signup({ username, password });
      setToken(res.id);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="container max-w-md mx-auto py-8">
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Sign up</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={handle}>
          <div className="mb-3">
            <label htmlFor="signup-username" className="label">Username</label>
            <input id="signup-username" className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="signup-password" className="label">Password</label>
            <input id="signup-password" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="text-right">
            <button className="btn btn-primary" type="submit">Create account</button>
          </div>
        </form>
      </div>
    </div>
  );
}
