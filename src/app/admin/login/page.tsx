"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "../admin.css";

export default function AdminLogin() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [setupKey, setSetupKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const body: Record<string, string> = { email, password };
      if (mode === "register") {
        body.action = "register";
        body.name = name;
        body.setupKey = setupKey;
      }

      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed");
        return;
      }

      router.push("/admin");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/trahbiz_logo.png"
            alt="Trahbiz"
            style={{ height: 32, margin: "0 auto 1rem" }}
          />
        </div>

        <h1>{mode === "login" ? "Admin Login" : "Create Admin Account"}</h1>
        <p className="subtitle">
          {mode === "login"
            ? "Sign in to manage your website content"
            : "Set up your first admin account"}
        </p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <div className="admin-form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Setup Key</label>
                <input
                  type="password"
                  className="admin-input"
                  value={setupKey}
                  onChange={(e) => setSetupKey(e.target.value)}
                  placeholder="From .env ADMIN_SETUP_KEY"
                  required
                />
              </div>
            </>
          )}

          <div className="admin-form-group">
            <label>Email</label>
            <input
              type="email"
              className="admin-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@trahbiz.com"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Password</label>
            <input
              type="password"
              className="admin-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            style={{ width: "100%", marginTop: "0.5rem" }}
            disabled={loading}
          >
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.78rem", color: "#737373" }}>
          {mode === "login" ? (
            <>
              First time?{" "}
              <button
                onClick={() => { setMode("register"); setError(""); }}
                style={{ color: "#dc2626", background: "none", border: "none", textDecoration: "underline", fontSize: "inherit" }}
              >
                Create admin account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => { setMode("login"); setError(""); }}
                style={{ color: "#dc2626", background: "none", border: "none", textDecoration: "underline", fontSize: "inherit" }}
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
