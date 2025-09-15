import React, { useEffect, useState } from "react";
import api from "../api/api";
import { decodeJwt, getEmail, clearAuth } from "../lib/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type Note = {
  _id: string;
  title: string;
  content: string;
  createdAt?: string;
};

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("saas_notes_token") || null;
  const payload = token ? decodeJwt(token) : null;
  const role = (payload && payload.role) || "member";
  const email = getEmail() || "";
  const slug = (email.split("@")[1] || "").split(".")[0] || "acme";

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/notes");
      setNotes(res.data);
      setLimitReached(res.data.length >= 3);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        toast.error("Session expired");
        clearAuth();
        navigate("/login");
      } else {
        toast.error("Failed to fetch notes");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const createNote = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      await api.post("/notes", { title, content });
      toast.success("Note created");
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      if (
        err?.response?.status === 403 &&
        msg?.toLowerCase().includes("note limit")
      ) {
        setLimitReached(true);
        toast.error("Note limit reached — upgrade to pro");
      } else {
        toast.error(msg || "Failed to create note");
      }
    }
  };

  const deleteNote = async (id: string) => {
    if (!confirm("Delete note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Deleted");
      fetchNotes();
    } catch {
      toast.error("Delete failed");
    }
  };

  const upgradeTenant = async () => {
    try {
      await api.post(`/tenants/${slug}/upgrade`);
      toast.success("Upgraded to Pro — note limit removed");
      setLimitReached(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Upgrade failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Notes</h1>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              Role: <strong>{role}</strong>
            </div>
            <button
              onClick={() => {
                clearAuth();
                navigate("/login");
              }}
              className="text-sm px-3 py-1 border rounded"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="mb-6">
          <form onSubmit={createNote} className="space-y-2">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <div className="flex items-center gap-3">
              <button
                disabled={limitReached}
                className={`px-4 py-2 rounded ${
                  limitReached ? "bg-gray-400" : "bg-blue-600 text-white"
                }`}
              >
                Create note
              </button>
              {limitReached && (
                <div className="text-sm text-red-600">
                  Limit reached (Free). Upgrade to Pro for unlimited notes.
                </div>
              )}
            </div>
          </form>
        </section>

        <section className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium">All Notes ({notes.length})</h2>
            {limitReached && role === "admin" && (
              <button
                onClick={upgradeTenant}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Upgrade to Pro
              </button>
            )}
            {limitReached && role !== "admin" && (
              <div className="text-sm text-gray-700">
                You can ask the admin to upgrade this tenant.
              </div>
            )}
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map((n) => (
                <div key={n._id} className="p-4 bg-white rounded shadow">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{n.title}</h3>
                    <button
                      onClick={() => deleteNote(n._id)}
                      className="text-sm text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">{n.content}</p>
                  <div className="mt-2 text-xs text-gray-400">
                    {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
