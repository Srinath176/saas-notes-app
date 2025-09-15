import React, { type JSX } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Notes from "./pages/Notes";
import { getToken } from "./lib/auth";

const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/notes"
        element={
          <RequireAuth>
            <Notes />
          </RequireAuth>
        }
      />
      <Route path="/" element={<Navigate to="/notes" replace />} />
    </Routes>
  );
}
