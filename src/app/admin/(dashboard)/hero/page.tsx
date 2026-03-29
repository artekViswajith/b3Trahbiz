"use client";

import { useEffect, useState } from "react";
import { useToast } from "../layout";

export default function HeroEditor() {
  const { toast } = useToast();
  const [data, setData] = useState({
    kicker: "",
    headline: "",
    subtitle: "",
    ctaText: "",
    ctaLink: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/content/hero")
      .then((r) => r.json())
      .then((d) => setData({ kicker: d.kicker, headline: d.headline, subtitle: d.subtitle, ctaText: d.ctaText, ctaLink: d.ctaLink }));
  }, []);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/content/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) toast("Hero section saved successfully");
      else toast("Failed to save", "error");
    } catch {
      toast("Network error", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="admin-header">
        <h1>Hero Section</h1>
        <p>Edit the main landing hero area of your website</p>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">Hero Content</div>

        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label>Kicker Text</label>
            <input className="admin-input" value={data.kicker} onChange={(e) => setData({ ...data, kicker: e.target.value })} placeholder="Premium Travel & Hospitality" />
          </div>
          <div className="admin-form-group">
            <label>CTA Button Text</label>
            <input className="admin-input" value={data.ctaText} onChange={(e) => setData({ ...data, ctaText: e.target.value })} placeholder="Start Exploring" />
          </div>
        </div>

        <div className="admin-form-group">
          <label>Headline</label>
          <input className="admin-input" value={data.headline} onChange={(e) => setData({ ...data, headline: e.target.value })} placeholder="Redefining Global Hospitality" />
        </div>

        <div className="admin-form-group">
          <label>Subtitle</label>
          <textarea className="admin-textarea" value={data.subtitle} onChange={(e) => setData({ ...data, subtitle: e.target.value })} placeholder="Curated journeys across..." />
        </div>

        <div className="admin-form-group">
          <label>CTA Link</label>
          <input className="admin-input" value={data.ctaLink} onChange={(e) => setData({ ...data, ctaLink: e.target.value })} placeholder="#" />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
          <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}
