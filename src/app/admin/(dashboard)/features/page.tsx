"use client";

import { useEffect, useState } from "react";
import { useToast } from "../layout";

interface Feature {
  id?: number;
  sortOrder: number;
  number: string;
  title: string;
  description: string;
  iconSvg: string;
}

export default function FeaturesEditor() {
  const { toast } = useToast();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/content/features")
      .then((r) => r.json())
      .then((d) => setFeatures(d));
  }, []);

  function updateFeature(index: number, field: keyof Feature, value: string | number) {
    setFeatures((prev) => prev.map((f, i) => (i === index ? { ...f, [field]: value } : f)));
  }

  function addFeature() {
    setFeatures((prev) => [
      ...prev,
      {
        sortOrder: prev.length + 1,
        number: String(prev.length + 1).padStart(2, "0"),
        title: "",
        description: "",
        iconSvg: "",
      },
    ]);
  }

  async function removeFeature(index: number) {
    const feature = features[index];
    if (feature.id) {
      await fetch(`/api/content/features?id=${feature.id}`, { method: "DELETE" });
    }
    setFeatures((prev) => prev.filter((_, i) => i !== index));
    toast("Feature removed");
  }

  async function save() {
    setSaving(true);
    try {
      // Save existing ones via PUT, create new ones via POST
      const existing = features.filter((f) => f.id);
      const newOnes = features.filter((f) => !f.id);

      if (existing.length > 0) {
        await fetch("/api/content/features", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ features: existing }),
        });
      }

      for (const f of newOnes) {
        await fetch("/api/content/features", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(f),
        });
      }

      // Reload
      const res = await fetch("/api/content/features");
      setFeatures(await res.json());
      toast("Features saved successfully");
    } catch {
      toast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="admin-header">
        <h1>Features</h1>
        <p>Manage showcase features displayed on the homepage</p>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem", gap: "0.5rem" }}>
        <button className="admin-btn admin-btn-secondary" onClick={addFeature}>+ Add Feature</button>
        <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save All"}
        </button>
      </div>

      {features.map((feature, i) => (
        <div key={feature.id || `new-${i}`} className="admin-sortable-item" style={{ flexDirection: "column" }}>
          <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#dc2626", fontWeight: 500, fontSize: "0.8rem" }}>#{feature.number}</span>
            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => removeFeature(i)}>Remove</button>
          </div>
          <div className="admin-grid-2" style={{ width: "100%", marginTop: "0.75rem" }}>
            <div className="admin-form-group">
              <label>Number</label>
              <input className="admin-input" value={feature.number} onChange={(e) => updateFeature(i, "number", e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label>Title</label>
              <input className="admin-input" value={feature.title} onChange={(e) => updateFeature(i, "title", e.target.value)} />
            </div>
          </div>
          <div className="admin-form-group" style={{ width: "100%" }}>
            <label>Description</label>
            <textarea className="admin-textarea" value={feature.description} onChange={(e) => updateFeature(i, "description", e.target.value)} style={{ minHeight: 70 }} />
          </div>
          <div className="admin-form-group" style={{ width: "100%" }}>
            <label>Icon SVG (paste raw SVG markup)</label>
            <textarea className="admin-textarea" value={feature.iconSvg} onChange={(e) => updateFeature(i, "iconSvg", e.target.value)} style={{ minHeight: 60, fontFamily: "monospace", fontSize: "0.75rem" }} />
          </div>
        </div>
      ))}
    </>
  );
}
