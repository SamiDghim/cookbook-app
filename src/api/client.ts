import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
// console.log('[client] Resolved API_URL =', API_URL);
export const api = axios.create({ baseURL: API_URL });
