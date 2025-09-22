import { useState } from 'react';
import { signup } from '../api/auth';
import { useAuth } from '../components/Auth';
import { useNavigate } from 'react-router-dom';

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
            <label className="label">Username</label>
            <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="label">Password</label>
            <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="text-right">
            <button className="btn btn-primary" type="submit">Create account</button>
          </div>
        </form>
      </div>
    </div>
  );
}
