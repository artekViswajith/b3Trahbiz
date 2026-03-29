"use client";

import { useEffect, useState } from "react";
import { useToast } from "../layout";

interface Property {
  id?: number;
  sortOrder: number;
  name: string;
  location: string;
  details: string;
  imageUrl: string;
}

export default function PropertiesEditor() {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/content/properties")
      .then((r) => r.json())
      .then((d) => setProperties(d));
  }, []);

  function updateProp(index: number, field: keyof Property, value: string | number) {
    setProperties((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  }

  function addProperty() {
    setProperties((prev) => [
      ...prev,
      { sortOrder: prev.length + 1, name: "", location: "", details: "", imageUrl: "" },
    ]);
  }

  async function removeProperty(index: number) {
    const prop = properties[index];
    if (prop.id) {
      await fetch(`/api/content/properties?id=${prop.id}`, { method: "DELETE" });
    }
    setProperties((prev) => prev.filter((_, i) => i !== index));
    toast("Property removed");
  }

  async function save() {
    setSaving(true);
    try {
      const existing = properties.filter((p) => p.id);
      const newOnes = properties.filter((p) => !p.id);

      if (existing.length > 0) {
        await fetch("/api/content/properties", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ properties: existing }),
        });
      }

      for (const p of newOnes) {
        await fetch("/api/content/properties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p),
        });
      }

      const res = await fetch("/api/content/properties");
      setProperties(await res.json());
      toast("Properties saved successfully");
    } catch {
      toast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="admin-header">
        <h1>Properties</h1>
        <p>Manage hotel properties displayed on the Our Properties page</p>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem", gap: "0.5rem" }}>
        <button className="admin-btn admin-btn-secondary" onClick={addProperty}>+ Add Property</button>
        <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save All"}
        </button>
      </div>

      {properties.map((prop, i) => (
        <div key={prop.id || `new-${i}`} className="admin-sortable-item" style={{ flexDirection: "column" }}>
          <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#dc2626", fontWeight: 500, fontSize: "0.8rem" }}>{prop.name || "Untitled"}</span>
            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => removeProperty(i)}>Remove</button>
          </div>
          <div className="admin-grid-2" style={{ width: "100%", marginTop: "0.75rem" }}>
            <div className="admin-form-group">
              <label>Name</label>
              <input className="admin-input" value={prop.name} onChange={(e) => updateProp(i, "name", e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label>Location</label>
              <input className="admin-input" value={prop.location} onChange={(e) => updateProp(i, "location", e.target.value)} />
            </div>
          </div>
          <div className="admin-form-group" style={{ width: "100%" }}>
            <label>Details</label>
            <textarea className="admin-textarea" value={prop.details} onChange={(e) => updateProp(i, "details", e.target.value)} style={{ minHeight: 70 }} />
          </div>
          <div className="admin-form-group" style={{ width: "100%" }}>
            <label>Image URL</label>
            <input className="admin-input" value={prop.imageUrl} onChange={(e) => updateProp(i, "imageUrl", e.target.value)} />
          </div>
        </div>
      ))}
    </>
  );
}
