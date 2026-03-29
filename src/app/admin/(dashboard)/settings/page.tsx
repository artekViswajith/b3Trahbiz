"use client";

import { useEffect, useState } from "react";
import { useToast } from "../layout";

interface NavLink { label: string; href: string; isActive: boolean; }
interface SocialLink { label: string; url: string; isActive: boolean; }

export default function SettingsEditor() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    siteName: "",
    siteTagline: "",
    logoUrl: "",
    metaTitle: "",
    metaDesc: "",
  });
  const [footer, setFooter] = useState({ tagline: "", copyright: "" });
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/content/settings")
      .then((r) => r.json())
      .then((d) => {
        setSettings({
          siteName: d.settings.siteName || "",
          siteTagline: d.settings.siteTagline || "",
          logoUrl: d.settings.logoUrl || "",
          metaTitle: d.settings.metaTitle || "",
          metaDesc: d.settings.metaDesc || "",
        });
        setFooter({
          tagline: d.footer.tagline || "",
          copyright: d.footer.copyright || "",
        });
        setNavLinks(d.navLinks.map((l: any) => ({ label: l.label, href: l.href, isActive: l.isActive })));
        setSocialLinks(d.socialLinks.map((l: any) => ({ label: l.label, url: l.url, isActive: l.isActive })));
      });
  }, []);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/content/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings, footer, navLinks, socialLinks }),
      });
      if (res.ok) toast("Settings saved successfully");
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
        <h1>Site Settings</h1>
        <p>Global settings, navigation, social links, and footer configuration</p>
      </div>

      {/* Site Settings */}
      <div className="admin-card">
        <div className="admin-card-title">General Settings</div>
        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label>Site Name</label>
            <input className="admin-input" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label>Site Tagline</label>
            <input className="admin-input" value={settings.siteTagline} onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })} />
          </div>
        </div>
        <div className="admin-form-group">
          <label>Logo URL</label>
          <input className="admin-input" value={settings.logoUrl} onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })} />
        </div>
        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label>Meta Title</label>
            <input className="admin-input" value={settings.metaTitle} onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label>Meta Description</label>
            <textarea className="admin-textarea" value={settings.metaDesc} onChange={(e) => setSettings({ ...settings, metaDesc: e.target.value })} style={{ minHeight: 60 }} />
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="admin-card">
        <div className="admin-card-title">
          Navigation Links
          <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setNavLinks([...navLinks, { label: "", href: "", isActive: true }])} style={{ marginLeft: "auto" }}>
            + Add
          </button>
        </div>
        {navLinks.map((link, i) => (
          <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
            <input className="admin-input" placeholder="Label" value={link.label} onChange={(e) => { const arr = [...navLinks]; arr[i].label = e.target.value; setNavLinks(arr); }} style={{ flex: 1 }} />
            <input className="admin-input" placeholder="/href" value={link.href} onChange={(e) => { const arr = [...navLinks]; arr[i].href = e.target.value; setNavLinks(arr); }} style={{ flex: 1 }} />
            <label style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.72rem", color: "#737373", whiteSpace: "nowrap" }}>
              <input type="checkbox" checked={link.isActive} onChange={(e) => { const arr = [...navLinks]; arr[i].isActive = e.target.checked; setNavLinks(arr); }} />
              Active
            </label>
            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setNavLinks(navLinks.filter((_, j) => j !== i))}>✕</button>
          </div>
        ))}
      </div>

      {/* Social Links */}
      <div className="admin-card">
        <div className="admin-card-title">
          Social Links
          <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setSocialLinks([...socialLinks, { label: "", url: "", isActive: true }])} style={{ marginLeft: "auto" }}>
            + Add
          </button>
        </div>
        {socialLinks.map((link, i) => (
          <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
            <input className="admin-input" placeholder="Label" value={link.label} onChange={(e) => { const arr = [...socialLinks]; arr[i].label = e.target.value; setSocialLinks(arr); }} style={{ flex: 1 }} />
            <input className="admin-input" placeholder="https://..." value={link.url} onChange={(e) => { const arr = [...socialLinks]; arr[i].url = e.target.value; setSocialLinks(arr); }} style={{ flex: 1 }} />
            <label style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.72rem", color: "#737373", whiteSpace: "nowrap" }}>
              <input type="checkbox" checked={link.isActive} onChange={(e) => { const arr = [...socialLinks]; arr[i].isActive = e.target.checked; setSocialLinks(arr); }} />
              Active
            </label>
            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setSocialLinks(socialLinks.filter((_, j) => j !== i))}>✕</button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="admin-card">
        <div className="admin-card-title">Footer</div>
        <div className="admin-form-group">
          <label>Footer Tagline</label>
          <input className="admin-input" value={footer.tagline} onChange={(e) => setFooter({ ...footer, tagline: e.target.value })} />
        </div>
        <div className="admin-form-group">
          <label>Copyright Text</label>
          <input className="admin-input" value={footer.copyright} onChange={(e) => setFooter({ ...footer, copyright: e.target.value })} />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem", marginBottom: "3rem" }}>
        <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save All Settings"}
        </button>
      </div>
    </>
  );
}
