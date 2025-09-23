import { useEffect, useState } from 'react';
import { fetchProfile } from '../api/auth';

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not logged in');
      return;
    }
    fetchProfile(token).then(setProfile).catch((e) => setError(e?.response?.data?.message || 'Failed to load'));
  }, []);

  if (error) return <div className="container py-8"><div className="card text-red-600">{error}</div></div>;
  if (!profile) return <div className="container py-8"><div className="card">Loading...</div></div>;

  return (
    <div className="container py-8">
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Profile</h2>
        <p><strong>Username:</strong> {profile.username}</p>
        <p className="text-sm text-gray-600">Member since: {new Date(profile.createdAt).toLocaleDateString()}</p>
        <div className="mt-4">
          <button type="button" className="btn" onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }}>Logout</button>
        </div>
      </div>
    </div>
  );
}
