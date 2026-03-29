"use client";

import { useEffect, useState } from "react";
import { useToast } from "../layout";

interface Service {
  id?: number;
  sortOrder: number;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
}

export default function ServicesEditor() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/content/services")
      .then((r) => r.json())
      .then((d) => setServices(d));
  }, []);

  function updateService(index: number, field: keyof Service, value: string | number) {
    setServices((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  function addService() {
    setServices((prev) => [
      ...prev,
      {
        sortOrder: prev.length + 1,
        number: String(prev.length + 1).padStart(2, "0"),
        title: "",
        subtitle: "",
        description: "",
        imageUrl: "",
      },
    ]);
  }

  async function removeService(index: number) {
    const service = services[index];
    if (service.id) {
      await fetch(`/api/content/services?id=${service.id}`, { method: "DELETE" });
    }
    setServices((prev) => prev.filter((_, i) => i !== index));
    toast("Service removed");
  }

  async function save() {
    setSaving(true);
    try {
      const existing = services.filter((s) => s.id);
      const newOnes = services.filter((s) => !s.id);

      if (existing.length > 0) {
        await fetch("/api/content/services", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ services: existing }),
        });
      }

      for (const s of newOnes) {
        await fetch("/api/content/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(s),
        });
      }

      const res = await fetch("/api/content/services");
      setServices(await res.json());
      toast("Services saved successfully");
    } catch {
      toast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="admin-header">
        <h1>Services</h1>
        <p>Manage the horizontal scroll services section</p>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem", gap: "0.5rem" }}>
        <button className="admin-btn admin-btn-secondary" onClick={addService}>+ Add Service</button>
        <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save All"}
        </button>
      </div>

      {services.map((service, i) => (
        <div key={service.id || `new-${i}`} className="admin-sortable-item" style={{ flexDirection: "column" }}>
          <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#dc2626", fontWeight: 500, fontSize: "0.8rem" }}>#{service.number} — {service.title || "Untitled"}</span>
            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => removeService(i)}>Remove</button>
          </div>
          <div className="admin-grid-2" style={{ width: "100%", marginTop: "0.75rem" }}>
            <div className="admin-form-group">
              <label>Number</label>
              <input className="admin-input" value={service.number} onChange={(e) => updateService(i, "number", e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label>Title</label>
              <input className="admin-input" value={service.title} onChange={(e) => updateService(i, "title", e.target.value)} />
            </div>
          </div>
          <div className="admin-form-group" style={{ width: "100%" }}>
            <label>Subtitle</label>
            <input className="admin-input" value={service.subtitle} onChange={(e) => updateService(i, "subtitle", e.target.value)} />
          </div>
          <div className="admin-form-group" style={{ width: "100%" }}>
            <label>Description</label>
            <textarea className="admin-textarea" value={service.description} onChange={(e) => updateService(i, "description", e.target.value)} style={{ minHeight: 70 }} />
          </div>
          <div className="admin-form-group" style={{ width: "100%" }}>
            <label>Image URL</label>
            <input className="admin-input" value={service.imageUrl} onChange={(e) => updateService(i, "imageUrl", e.target.value)} />
            {service.imageUrl && (
              <div style={{ marginTop: "0.5rem", borderRadius: 6, overflow: "hidden", maxWidth: 200 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={service.imageUrl} alt="Preview" style={{ width: "100%", height: "auto" }} />
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
