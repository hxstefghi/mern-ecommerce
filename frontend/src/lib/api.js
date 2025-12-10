import axios from "axios";

// Use Vite env var `VITE_API_URL` when provided (for deployed client),
// otherwise fall back to local backend during development.
// Example in client `.env`: VITE_API_URL=https://api.yoursite.com
const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, "")}/api`
  : "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
});

export default api;
