"use client";

import { useEffect, useState } from "react";
import { useToast } from "../layout";

export default function AboutEditor() {
  const { toast } = useToast();
  const [data, setData] = useState({
    kicker: "",
    title: "",
    leadText: "",
    subheading1: "",
    paragraph1: "",
    paragraph2: "",
    subheading2: "",
    paragraph3: "",
    listItems: [] as string[],
    closingText: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/content/about")
      .then((r) => r.json())
      .then((d) => setData({
        kicker: d.kicker || "",
        title: d.title || "",
        leadText: d.leadText || "",
        subheading1: d.subheading1 || "",
        paragraph1: d.paragraph1 || "",
        paragraph2: d.paragraph2 || "",
        subheading2: d.subheading2 || "",
        paragraph3: d.paragraph3 || "",
        listItems: d.listItems || [],
        closingText: d.closingText || "",
      }));
  }, []);

  function updateField(field: string, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function updateListItem(index: number, value: string) {
    const items = [...data.listItems];
    items[index] = value;
    setData((prev) => ({ ...prev, listItems: items }));
  }

  function addListItem() {
    setData((prev) => ({ ...prev, listItems: [...prev.listItems, ""] }));
  }

  function removeListItem(index: number) {
    setData((prev) => ({ ...prev, listItems: prev.listItems.filter((_, i) => i !== index) }));
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/content/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) toast("About section saved successfully");
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
        <h1>About Section</h1>
        <p>Edit the About B3 Group section content</p>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">Section Header</div>
        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label>Kicker</label>
            <input className="admin-input" value={data.kicker} onChange={(e) => updateField("kicker", e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label>Title</label>
            <input className="admin-input" value={data.title} onChange={(e) => updateField("title", e.target.value)} />
          </div>
        </div>
        <div className="admin-form-group">
          <label>Lead Text</label>
          <textarea className="admin-textarea" value={data.leadText} onChange={(e) => updateField("leadText", e.target.value)} />
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">Content Blocks</div>
        <div className="admin-form-group">
          <label>Subheading 1</label>
          <input className="admin-input" value={data.subheading1} onChange={(e) => updateField("subheading1", e.target.value)} />
        </div>
        <div className="admin-form-group">
          <label>Paragraph 1</label>
          <textarea className="admin-textarea" value={data.paragraph1} onChange={(e) => updateField("paragraph1", e.target.value)} />
        </div>
        <div className="admin-form-group">
          <label>Paragraph 2</label>
          <textarea className="admin-textarea" value={data.paragraph2} onChange={(e) => updateField("paragraph2", e.target.value)} />
        </div>
        <div className="admin-form-group">
          <label>Subheading 2</label>
          <input className="admin-input" value={data.subheading2} onChange={(e) => updateField("subheading2", e.target.value)} />
        </div>
        <div className="admin-form-group">
          <label>Paragraph 3</label>
          <textarea className="admin-textarea" value={data.paragraph3} onChange={(e) => updateField("paragraph3", e.target.value)} />
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">
          List Items
          <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={addListItem} style={{ marginLeft: "auto" }}>
            + Add Item
          </button>
        </div>
        {data.listItems.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <input className="admin-input" value={item} onChange={(e) => updateListItem(i, e.target.value)} />
            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => removeListItem(i)}>✕</button>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-form-group">
          <label>Closing Text</label>
          <textarea className="admin-textarea" value={data.closingText} onChange={(e) => updateField("closingText", e.target.value)} />
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
