"use client";

import { useEffect, useState } from "react";
import { useToast } from "../layout";

interface Package {
  id?: number;
  sortOrder: number;
  title: string;
  summary: string;
  imageUrl: string;
}

export default function PackagesEditor() {
  const { toast } = useToast();
  const [packages, setPackages] = useState<Package[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/content/packages")
      .then((r) => r.json())
      .then((d) => setPackages(d));
  }, []);

  function updatePkg(index: number, field: keyof Package, value: string | number) {
    setPackages((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  }

  function addPackage() {
    setPackages((prev) => [
      ...prev,
      { sortOrder: prev.length + 1, title: "", summary: "", imageUrl: "" },
    ]);
  }

  async function removePackage(index: number) {
    const pkg = packages[index];
    if (pkg.id) {
      await fetch(`/api/content/packages?id=${pkg.id}`, { method: "DELETE" });
    }
    setPackages((prev) => prev.filter((_, i) => i !== index));
    toast("Package removed");
  }

  async function save() {
    setSaving(true);
    try {
      const existing = packages.filter((p) => p.id);
      const newOnes = packages.filter((p) => !p.id);

      if (existing.length > 0) {
        await fetch("/api/content/packages", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ packages: existing }),
        });
      }

      for (const p of newOnes) {
        await fetch("/api/content/packages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p),
        });
      }

      const res = await fetch("/api/content/packages");
      setPackages(await res.json());
      toast("Packages saved successfully");
    } catch {
      toast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="admin-header">
        <h1>Packages</h1>
        <p>Manage travel packages displayed on the Our Packages page</p>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem", gap: "0.5rem" }}>
        <button className="admin-btn admin-btn-secondary" onClick={addPackage}>+ Add Package</button>
        <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save All"}
        </button>
      </div>

      {packages.map((pkg, i) => (
        <div key={pkg.id || `new-${i}`} className="admin-sortable-item" style={{ flexDirection: "column" }}>
          <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#dc2626", fontWeight: 500, fontSize: "0.8rem" }}>{pkg.title || "Untitled"}</span>
            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => removePackage(i)}>Remove</button>
          </div>
          <div className="admin-form-group" style={{ width: "100%", marginTop: "0.75rem" }}>
            <label>Title</label>
            <input className="admin-input" value={pkg.title} onChange={(e) => updatePkg(i, "title", e.target.value)} />
          </div>
          <div className="admin-form-group" style={{ width: "100%" }}>
            <label>Summary</label>
            <textarea className="admin-textarea" value={pkg.summary} onChange={(e) => updatePkg(i, "summary", e.target.value)} style={{ minHeight: 70 }} />
          </div>
          <div className="admin-form-group" style={{ width: "100%" }}>
            <label>Image URL</label>
            <input className="admin-input" value={pkg.imageUrl} onChange={(e) => updatePkg(i, "imageUrl", e.target.value)} />
          </div>
        </div>
      ))}
    </>
  );
}
