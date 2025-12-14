import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Login';
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center py-12 px-6">
      <div className="max-w-md w-full">
        <div className="mb-12">
          <h2 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-2">Welcome Back</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-light">Sign in to your account</p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          {error && (
            <div className="border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 text-sm font-light bg-white dark:bg-gray-900">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2 font-light tracking-wide">
              EMAIL
            </label>
            <input
              type="email"
              required
              className="w-full px-0 py-3 border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-gray-900 dark:focus:border-gray-100 transition-colors bg-transparent text-sm font-light dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2 font-light tracking-wide">
              PASSWORD
            </label>
            <input
              type="password"
              required
              className="w-full px-0 py-3 border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-gray-900 dark:focus:border-gray-100 transition-colors bg-transparent text-sm font-light dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 py-4 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-sm font-light tracking-wide mt-8"
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-gray-900 dark:text-gray-100 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
