"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/storeContext";
import { DbService } from "@/lib/dbService";

export default function AdminProductsList() {
  const { products, refreshCatalog } = useStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete product "${id}"? This cannot be undone.`)) {
      const ok = await DbService.deleteProduct(id);
      if (ok) {
        alert("Product deleted successfully.");
        refreshCatalog();
      } else {
        alert("Delete failed.");
      }
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "draft" : "active";
    const ok = await DbService.updateProduct(id, { status: nextStatus });
    if (ok) {
      refreshCatalog();
    } else {
      alert("Failed to toggle status.");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="admin-page-title" style={{ fontSize: "1.75rem", fontWeight: 800 }}>
          PRODUCTS MANAGER
        </h1>
        <Link href="/admin/products/add" className="btn btn-primary" style={{ padding: "0.75rem 1.5rem" }}>
          + ADD NEW PRODUCT
        </Link>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: "2rem", backgroundColor: "#fff", padding: "1.25rem", border: "1px solid #e5e7eb", borderRadius: "4px" }}>
        <input 
          type="text" 
          placeholder="Search products by ID, name, or category..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            fontFamily: "var(--font-heading)",
            fontSize: "0.8rem",
            border: "1px solid #d1d5db"
          }}
        />
      </div>

      {/* Products Table */}
      <div className="table-responsive" style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "4px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb", color: "#4b5563", fontFamily: "var(--font-heading)", fontWeight: 800 }}>
              <th style={{ padding: "1rem" }}>PRODUCT ID</th>
              <th style={{ padding: "1rem" }}>IMAGE</th>
              <th style={{ padding: "1rem" }}>NAME</th>
              <th style={{ padding: "1rem" }}>CATEGORY</th>
              <th style={{ padding: "1rem" }}>PRICE</th>
              <th style={{ padding: "1rem" }}>STATUS</th>
              <th style={{ padding: "1rem" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "1rem", fontWeight: 800 }}>{p.id}</td>
                  <td style={{ padding: "1rem" }}>
                    <img 
                      src={p.images?.[0] || "/images/logo/logo.png"} 
                      alt={p.name} 
                      style={{ width: "40px", height: "50px", objectFit: "cover", backgroundColor: "#f3f4f6" }} 
                    />
                  </td>
                  <td style={{ padding: "1rem", fontWeight: 800 }}>{p.name}</td>
                  <td style={{ padding: "1rem" }}>{p.category}</td>
                  <td style={{ padding: "1rem" }}>₹{p.price.toLocaleString()}</td>
                  <td style={{ padding: "1rem" }}>
                    <button
                      type="button"
                      onClick={() => handleStatusToggle(p.id, p.status)}
                      className={`admin-badge ${p.status === "active" ? "badge-in-stock" : "badge-out-stock"}`}
                      style={{ border: "none", cursor: "pointer", display: "inline-block" }}
                    >
                      {p.status === "active" ? "ACTIVE" : "DRAFT"}
                    </button>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", gap: "0.75rem", fontFamily: "var(--font-heading)" }}>
                      <Link 
                        href={`/admin/products/edit/${p.id}`}
                        style={{ color: "var(--color-primary)", textDecoration: "underline", fontWeight: 800 }}
                      >
                        EDIT
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        style={{ background: "none", border: "none", color: "var(--color-brand-red)", textDecoration: "underline", fontWeight: 800, cursor: "pointer" }}
                      >
                        DELETE
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
