import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-6">
      <div className="max-w-md w-full">
        <div className="mb-12">
          <h2 className="text-3xl font-light text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-sm text-gray-500 font-light">Sign in to your account</p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          {error && (
            <div className="border border-red-200 text-red-600 px-4 py-3 text-sm font-light">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs text-gray-500 mb-2 font-light tracking-wide">
              EMAIL
            </label>
            <input
              type="email"
              required
              className="w-full px-0 py-3 border-b border-gray-200 focus:outline-none focus:border-gray-900 transition-colors bg-transparent text-sm font-light"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-2 font-light tracking-wide">
              PASSWORD
            </label>
            <input
              type="password"
              required
              className="w-full px-0 py-3 border-b border-gray-200 focus:outline-none focus:border-gray-900 transition-colors bg-transparent text-sm font-light"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-light tracking-wide mt-8"
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 font-light">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-gray-900 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
