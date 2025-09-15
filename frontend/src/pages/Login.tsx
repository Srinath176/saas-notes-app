import React, { useState } from "react";
import api from "../api/api";
import { setToken, setEmail } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

/**
 * Login component for user authentication
 * Handles login form submission and redirects to notes page on success
 */
export default function Login() {
  // Form state management
  const [email, setEmailField] = useState("admin@acme.test");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Handle form submission for user login
   * @param e - Form submission event
   */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Make login request to API
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.token;

      // Store authentication data
      setToken(token);
      setEmail(email);

      toast.success("Logged in");
      navigate("/notes");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border border-slate-200">
        <h1 className="text-2xl font-semibold mb-6 text-slate-800">
          SaaS Notes — Login
        </h1>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmailField(e.target.value)}
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white p-3 rounded-lg font-medium transition-colors shadow-md hover:cursor-pointer"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
          Use the seeded accounts (password:{" "}
          <code className="bg-slate-200 px-1 py-0.5 rounded text-xs">
            password
          </code>
          )
        </p>
      </div>
    </div>
  );
}
