import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Register';
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
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center py-12 px-6">
      <div className="max-w-md w-full">
        <div className="mb-12">
          <h2 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-2">Create Account</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-light">Join us today</p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          {error && (
            <div className="border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 text-sm font-light bg-white dark:bg-gray-900">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2 font-light tracking-wide">
              FULL NAME
            </label>
            <input
              type="text"
              required
              className="w-full px-0 py-3 border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-gray-900 dark:focus:border-gray-100 transition-colors bg-transparent text-sm font-light dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2 font-light tracking-wide">
              EMAIL
            </label>
            <input
              type="email"
              required
              className="w-full px-0 py-3 border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-gray-900 dark:focus:border-gray-100 transition-colors bg-transparent text-sm font-light dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
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
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 py-4 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-sm font-light tracking-wide mt-8"
          >
            {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-gray-900 dark:text-gray-100 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
