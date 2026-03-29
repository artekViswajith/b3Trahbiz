"use client";

import { useEffect, useState } from "react";
import { useToast } from "../layout";

interface Contact {
  id?: number;
  sortOrder: number;
  title: string;
  email: string;
  phone: string;
  address: string;
}

export default function ContactsEditor() {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/content/contacts")
      .then((r) => r.json())
      .then((d) => setContacts(d));
  }, []);

  function updateContact(index: number, field: keyof Contact, value: string | number) {
    setContacts((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  }

  function addContact() {
    setContacts((prev) => [
      ...prev,
      { sortOrder: prev.length + 1, title: "", email: "", phone: "", address: "" },
    ]);
  }

  async function removeContact(index: number) {
    const contact = contacts[index];
    if (contact.id) {
      await fetch(`/api/content/contacts?id=${contact.id}`, { method: "DELETE" });
    }
    setContacts((prev) => prev.filter((_, i) => i !== index));
    toast("Contact removed");
  }

  async function save() {
    setSaving(true);
    try {
      const existing = contacts.filter((c) => c.id);
      const newOnes = contacts.filter((c) => !c.id);

      if (existing.length > 0) {
        await fetch("/api/content/contacts", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contacts: existing }),
        });
      }

      for (const c of newOnes) {
        await fetch("/api/content/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(c),
        });
      }

      const res = await fetch("/api/content/contacts");
      setContacts(await res.json());
      toast("Contacts saved successfully");
    } catch {
      toast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="admin-header">
        <h1>Contact Info</h1>
        <p>Manage contact information displayed on the Contact Us page</p>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem", gap: "0.5rem" }}>
        <button className="admin-btn admin-btn-secondary" onClick={addContact}>+ Add Contact</button>
        <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save All"}
        </button>
      </div>

      {contacts.map((contact, i) => (
        <div key={contact.id || `new-${i}`} className="admin-sortable-item" style={{ flexDirection: "column" }}>
          <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#dc2626", fontWeight: 500, fontSize: "0.8rem" }}>{contact.title || "Untitled"}</span>
            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => removeContact(i)}>Remove</button>
          </div>
          <div className="admin-grid-2" style={{ width: "100%", marginTop: "0.75rem" }}>
            <div className="admin-form-group">
              <label>Title</label>
              <input className="admin-input" value={contact.title} onChange={(e) => updateContact(i, "title", e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label>Email</label>
              <input className="admin-input" value={contact.email} onChange={(e) => updateContact(i, "email", e.target.value)} />
            </div>
          </div>
          <div className="admin-grid-2" style={{ width: "100%" }}>
            <div className="admin-form-group">
              <label>Phone</label>
              <input className="admin-input" value={contact.phone} onChange={(e) => updateContact(i, "phone", e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label>Address</label>
              <input className="admin-input" value={contact.address} onChange={(e) => updateContact(i, "address", e.target.value)} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
