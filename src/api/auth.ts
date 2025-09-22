import { api } from './client';

export const signup = async (data: { username: string; password: string }) => {
  const res = await api.post('/api/signup', data);
  return res.data;
};

export const login = async (data: { username: string; password: string }) => {
  const res = await api.post('/api/login', data);
  return res.data;
};

export const fetchProfile = async (token?: string) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const res = await api.get('/api/profile', { headers });
  return res.data;
};
