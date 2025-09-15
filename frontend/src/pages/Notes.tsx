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

/**
 * Main Notes component - displays and manages user notes
 * Includes functionality for creating, reading, updating, and deleting notes
 * Also handles tenant upgrades and user role permissions
 */
export default function Notes() {
  // Note management state
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  
  // Edit mode state for updating notes
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  
  const navigate = useNavigate();

  // Extract user information from JWT token
  const token = localStorage.getItem("saas_notes_token") || null;
  const payload = token ? decodeJwt(token) : null;
  const role = (payload && payload.role) || "member";
  const email = getEmail() || "";
  const slug = (email.split("@")[1] || "").split(".")[0] || "acme";
  
  // Format tenant name for display
  const tenantName = slug.charAt(0).toUpperCase() + slug.slice(1);

  /**
   * Fetch all notes from the API
   * Updates the notes list and limit status
   */
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

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  /**
   * Create a new note
   * @param e - Form submission event
   */
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

  /**
   * Update an existing note
   * @param id - Note ID to update
   */
  const updateNote = async (id: string) => {
    try {
      await api.put(`/notes/${id}`, { 
        title: editTitle, 
        content: editContent 
      });
      toast.success("Note updated");
      setEditingNote(null);
      setEditTitle("");
      setEditContent("");
      fetchNotes();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update note");
    }
  };

  /**
   * Start editing a note - populate edit form with current values
   * @param note - Note to edit
   */
  const startEdit = (note: Note) => {
    setEditingNote(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  /**
   * Cancel editing and reset edit state
   */
  const cancelEdit = () => {
    setEditingNote(null);
    setEditTitle("");
    setEditContent("");
  };

  /**
   * Delete a note after confirmation
   * @param id - Note ID to delete
   */
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

  /**
   * Upgrade tenant to Pro plan (admin only)
   */
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with tenant info and logout */}
        <header className="flex items-center justify-between mb-8 bg-white rounded-xl shadow-md p-6 border border-slate-200">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Notes - Dashboard</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium">
                {tenantName}
              </span>
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                Role: <strong>{role}</strong>
              </span>
            </div>
          </div>
          
          <button
            onClick={() => {
              clearAuth();
              navigate("/login");
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 transition-colors font-medium hover:cursor-pointer"
          >
            Logout
          </button>
        </header>

        {/* Note creation form */}
        <section className="mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Create New Note
            </h2>
            
            <form onSubmit={createNote} className="space-y-4">
              <input
                placeholder="Enter note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                required
              />
              
              <textarea
                placeholder="Write your note content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-vertical"
                required
              />
              
              <div className="flex items-center gap-4">
                <button
                  disabled={limitReached}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:cursor-pointer ${
                    limitReached 
                      ? "bg-slate-400 text-white cursor-not-allowed" 
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  Create Note
                </button>
                
                {limitReached && (
                  <div className="text-sm text-amber-700 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
                    Limit reached (Free). Upgrade to Pro for unlimited notes.
                  </div>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* Notes list and upgrade section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-slate-800">
              All Notes ({notes.length})
            </h2>
            
            {/* Upgrade button for admin users */}
            {limitReached && role === "admin" && (
              <button
                onClick={upgradeTenant}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-md"
              >
                Upgrade to Pro
              </button>
            )}
            
            {/* Upgrade message for non-admin users */}
            {limitReached && role !== "admin" && (
              <div className="text-sm font-semibold text-green-800 bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
                You can ask your admin to upgrade this tenant.
              </div>
            )}
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="text-center py-12">
              <div className="text-slate-600">Loading notes...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {notes.map((note) => (
                <div key={note._id} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                  {editingNote === note._id ? (
                    /* Edit mode for note */
                    <div className="p-6 bg-slate-50">
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg mb-3 font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                      
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                        className="w-full p-2 border border-slate-300 rounded-lg mb-4 text-sm resize-vertical focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateNote(note._id)}
                          className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg font-medium transition-colors hover:cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex-1 px-3 py-2 bg-slate-400 hover:bg-slate-500 text-white text-xs rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Display mode for note */
                    <>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-slate-800 text-lg leading-tight">
                            {note.title}
                          </h3>
                          <div className="flex gap-2 ml-2">
                            <button
                              onClick={() => startEdit(note)}
                              className="text-xs text-emerald-600 hover:text-emerald-800 px-2 py-1 hover:bg-emerald-50 rounded transition-colors hover:cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteNote(note._id)}
                              className="text-xs text-red-600 hover:text-red-800 px-2 py-1 hover:bg-red-50 rounded transition-colors hover:cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-700 line-clamp-4 mb-4 leading-relaxed">
                          {note.content}
                        </p>
                      </div>
                      
                      {/* Note footer with timestamp */}
                      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
                        <div className="text-xs text-slate-500">
                          {note.createdAt ? new Date(note.createdAt).toLocaleString() : "No date"}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
              
              {/* Empty state */}
              {notes.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <div className="text-slate-400 text-lg mb-2">No notes yet</div>
                  <div className="text-slate-500 text-sm">Create your first note to get started</div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}