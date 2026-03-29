"use client";

import { useEffect, useState, useCallback, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import "../admin.css";

// ── Toast Context ──
interface Toast { message: string; type: "success" | "error" }
const ToastCtx = createContext<{ toast: (msg: string, type?: "success" | "error") => void }>({ toast: () => {} });
export const useToast = () => useContext(ToastCtx);

// ── Admin User Context ──
const UserCtx = createContext<{ user: any; reload: () => void }>({ user: null, reload: () => {} });
export const useAdminUser = () => useContext(UserCtx);

const NAV_ITEMS = [
  { section: "Content", items: [
    { href: "/admin", label: "Dashboard", icon: "◫" },
    { href: "/admin/hero", label: "Hero Section", icon: "⬡" },
    { href: "/admin/about", label: "About Section", icon: "☰" },
    { href: "/admin/features", label: "Features", icon: "✦" },
    { href: "/admin/services", label: "Services", icon: "⧫" },
  ]},
  { section: "Pages", items: [
    { href: "/admin/properties", label: "Properties", icon: "⌂" },
    { href: "/admin/packages", label: "Packages", icon: "❏" },
    { href: "/admin/contacts", label: "Contact Info", icon: "✉" },
  ]},
  { section: "Settings", items: [
    { href: "/admin/settings", label: "Site Settings", icon: "⚙" },
  ]},
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<(Toast & { id: number })[]>([]);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/me");
      if (!res.ok) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setUser(data.user);
    } catch {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const toast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/me", { method: "DELETE" });
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="admin-layout" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p style={{ color: "#737373", fontSize: "0.85rem" }}>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <UserCtx.Provider value={{ user, reload: checkAuth }}>
    <ToastCtx.Provider value={{ toast }}>
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/trahbiz_logo.png" alt="Trahbiz" />
            <span>CMS</span>
          </div>

          <nav className="admin-nav">
            {NAV_ITEMS.map((group) => (
              <div key={group.section}>
                <div className="admin-nav-section">{group.section}</div>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`admin-nav-link${pathname === item.href ? " active" : ""}`}
                  >
                    <span style={{ fontSize: "1rem", width: 18, textAlign: "center" }}>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>

          <div className="admin-user-section">
            <div style={{ color: "#e5e5e5", fontSize: "0.82rem" }}>{user.name}</div>
            <div style={{ color: "#525252", fontSize: "0.7rem" }}>{user.email}</div>
            <button onClick={handleLogout}>Sign out</button>
          </div>
        </aside>

        {/* Main */}
        <main className="admin-main">
          {children}
        </main>

        {/* Toasts */}
        {toasts.map((t) => (
          <div key={t.id} className={`admin-toast ${t.type}`}>
            {t.type === "success" ? "✓" : "✕"} {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
    </UserCtx.Provider>
  );
}
