"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/storeContext";
import { DbService } from "@/lib/dbService";

export default function AdminCategories() {
  const { categories, refreshCatalog } = useStore();
  const [newCatName, setNewCatName] = useState("");

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCatName.trim()) return;

    const id = "cat_" + newCatName.trim().toLowerCase().replace(/\s+/g, "_");
    const ok = await DbService.addCategory({
      id,
      name: newCatName.trim(),
      active: true
    });

    if (ok) {
      setNewCatName("");
      alert(`Category "${newCatName}" added successfully.`);
      refreshCatalog();
    } else {
      alert("Failed to add category.");
    }
  };

  const handleToggleActive = async (id: string, name: string, currentActive: boolean) => {
    const ok = await DbService.updateCategory(id, name, !currentActive);
    if (ok) {
      refreshCatalog();
    } else {
      alert("Failed to update category.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category? Products in this category will not be deleted but their category filter will remain unchanged.")) {
      const ok = await DbService.deleteCategory(id);
      if (ok) {
        alert("Category deleted.");
        refreshCatalog();
      } else {
        alert("Delete failed.");
      }
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", flexWrap: "wrap" }}>
      
      {/* List Categories */}
      <div>
        <h1 className="admin-page-title" style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "2rem" }}>
          CATEGORIES MANAGER
        </h1>

        <div className="table-responsive" style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "4px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#f9fafb", borderBottom: "2px solid #e5e7eb", color: "#4b5563", fontFamily: "var(--font-heading)", fontWeight: 800 }}>
                <th style={{ padding: "1rem" }}>NAME</th>
                <th style={{ padding: "1rem" }}>STATUS</th>
                <th style={{ padding: "1rem" }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map(cat => (
                  <tr key={cat.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "1rem", fontWeight: 800 }}>{cat.name}</td>
                    <td style={{ padding: "1rem" }}>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(cat.id, cat.name, cat.active)}
                        className={`admin-badge ${cat.active ? "badge-in-stock" : "badge-out-stock"}`}
                        style={{ border: "none", cursor: "pointer", display: "inline-block" }}
                      >
                        {cat.active ? "ACTIVE" : "INACTIVE"}
                      </button>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id)}
                        style={{ background: "none", border: "none", color: "var(--color-brand-red)", textDecoration: "underline", fontWeight: 800, cursor: "pointer" }}
                      >
                        DELETE
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Form */}
      <div style={{ alignSelf: "start" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "2rem" }}>
          ADD NEW CATEGORY
        </h2>

        <div style={{ backgroundColor: "#fff", padding: "2rem", border: "1px solid #e5e7eb", borderRadius: "4px" }}>
          <form onSubmit={handleAddCategory} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>CATEGORY NAME</label>
              <input 
                type="text" 
                placeholder="e.g. Graphic Tees" 
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db" }}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: "0.75rem" }}>
              CREATE CATEGORY
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
