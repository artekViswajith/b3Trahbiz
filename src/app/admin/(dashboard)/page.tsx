"use client";

import { useEffect, useState } from "react";

interface Stats {
  features: number;
  services: number;
  properties: number;
  packages: number;
  contacts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function load() {
      const [features, services, properties, packages, contacts] = await Promise.all([
        fetch("/api/content/features").then((r) => r.json()),
        fetch("/api/content/services").then((r) => r.json()),
        fetch("/api/content/properties").then((r) => r.json()),
        fetch("/api/content/packages").then((r) => r.json()),
        fetch("/api/content/contacts").then((r) => r.json()),
      ]);
      setStats({
        features: features.length,
        services: services.length,
        properties: properties.length,
        packages: packages.length,
        contacts: contacts.length,
      });
    }
    load();
  }, []);

  return (
    <>
      <div className="admin-header">
        <h1>Dashboard</h1>
        <p>Overview of your website content</p>
      </div>

      <div className="admin-grid-4" style={{ marginBottom: "2rem" }}>
        {[
          { label: "Features", value: stats?.features ?? "–" },
          { label: "Services", value: stats?.services ?? "–" },
          { label: "Properties", value: stats?.properties ?? "–" },
          { label: "Packages", value: stats?.packages ?? "–" },
        ].map((stat) => (
          <div key={stat.label} className="admin-stat-card">
            <div className="label">{stat.label}</div>
            <div className="value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="admin-grid-2">
        <div className="admin-card">
          <div className="admin-card-title">
            Quick Actions
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <a href="/admin/hero" className="admin-btn admin-btn-secondary" style={{ textDecoration: "none", textAlign: "center" }}>
              Edit Hero Section
            </a>
            <a href="/admin/features" className="admin-btn admin-btn-secondary" style={{ textDecoration: "none", textAlign: "center" }}>
              Manage Features
            </a>
            <a href="/admin/properties" className="admin-btn admin-btn-secondary" style={{ textDecoration: "none", textAlign: "center" }}>
              Manage Properties
            </a>
            <a href="/admin/settings" className="admin-btn admin-btn-secondary" style={{ textDecoration: "none", textAlign: "center" }}>
              Site Settings
            </a>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-title">
            Getting Started
          </div>
          <div style={{ fontSize: "0.82rem", color: "#a3a3a3", lineHeight: 1.7 }}>
            <p style={{ marginBottom: "0.5rem" }}>
              Welcome to the Trahbiz CMS. Use the sidebar navigation to edit any section of your website.
            </p>
            <p style={{ marginBottom: "0.5rem" }}>
              All changes are saved to your MySQL database and reflected on the live site immediately.
            </p>
            <p>
              <strong style={{ color: "#e5e5e5" }}>Tip:</strong> Start by seeding the database with default content using <code style={{ background: "#262626", padding: "0.15rem 0.4rem", borderRadius: 3, fontSize: "0.75rem" }}>npx prisma db seed</code>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
