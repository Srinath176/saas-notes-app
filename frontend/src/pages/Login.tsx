import React, { useState } from "react";
import api from "../api/api";
import { setToken, setEmail } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmailField] = useState("admin@acme.test");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.token;
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="text-xl font-semibold mb-4">SaaS Notes — Login</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm">Email</label>
            <input
              value={email}
              onChange={(e) => setEmailField(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Use the seeded accounts (password: <code>password</code>)
        </p>
      </div>
    </div>
  );
}
