"use client";

import React, { useState } from "react";
import { DbService } from "@/lib/dbService";

export default function AdminInitialize() {
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const startMigration = async () => {
    setLoading(true);
    setSuccess(false);
    setLog(["Initializing connection to Google Sheets API...", "Targeting: https://script.google.com/macros/s/.../exec"]);

    try {
      // 1. Fetch products from legacy Google Apps Script
      const sheetApiUrl = "https://script.google.com/macros/s/AKfycbyx5XM2-YXotaVZqRmby1pH_oCmrEBxCHf_SfwJZRLW3xMQBUwPmuxn8tfDMp20U5fl/exec?action=GET_PRODUCTS";
      const response = await fetch(sheetApiUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status} from Google Apps Script`);
      
      const data = await response.json();
      if (!data.success || !Array.isArray(data.products)) {
        throw new Error("Invalid payload format received from Google Apps Script");
      }

      setLog(prev => [...prev, `Successfully fetched ${data.products.length} products from Google Sheets!`, "Preparing Firestore payload..."]);

      // Map products to correct type format
      const formattedProducts = data.products.map((p: any) => ({
        id: String(p.id).trim().toUpperCase(),
        name: p.name,
        description: p.description || "",
        category: p.category || "T-Shirts",
        price: Number(p.price) || 0,
        originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
        images: Array.isArray(p.images) ? p.images : [],
        sizes: Array.isArray(p.sizes) ? p.sizes : ["S", "M", "L", "XL"],
        stock: p.stock && typeof p.stock === "object" ? p.stock : { S: 5, M: 5, L: 5, XL: 5 },
        status: p.status || "active",
        featured: p.featured === true || String(p.featured).toUpperCase() === "TRUE",
        newArrival: p.newArrival === true || String(p.newArrival).toUpperCase() === "TRUE",
        bestseller: p.bestseller === true || String(p.bestseller).toUpperCase() === "TRUE"
      }));

      // 2. Initialize Firestore DB
      setLog(prev => [...prev, "Writing categories, configuration settings, and products to Firestore collections..."]);
      const ok = await DbService.initializeDatabase(formattedProducts);
      if (!ok) throw new Error("Firestore batch write failed");

      setLog(prev => [...prev, "✓ Migration and seeding completed successfully!", "ManusDrip database is now fully active on Firebase Firestore!"]);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setLog(prev => [...prev, `✕ Error occurred: ${err.message || err}`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h1 className="admin-page-title" style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "2rem" }}>
        FIRESTORE INITIALIZER & MIGRATION
      </h1>

      <div style={{ backgroundColor: "#fff", padding: "2rem", border: "1px solid #e5e7eb", borderRadius: "4px" }}>
        <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.6, marginBottom: "1.5rem" }}>
          This utility migrates all active products, stock, categories, and configurations directly from your legacy Google Sheets database to your new Firebase Firestore collections.
        </p>

        <button
          type="button"
          onClick={startMigration}
          disabled={loading}
          className="btn btn-primary w-100"
          style={{ padding: "0.85rem", fontSize: "0.85rem" }}
        >
          {loading ? "MIGRATING DATABASE..." : "FETCH & IMPORT FROM GOOGLE SHEETS"}
        </button>

        {log.length > 0 && (
          <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "2px" }}>
            <h4 style={{ fontSize: "0.75rem", fontWeight: 800, marginBottom: "0.5rem", color: "#374151" }}>MIGRATION LOG</h4>
            <div style={{ fontSize: "0.7rem", fontFamily: "monospace", display: "flex", flexDirection: "column", gap: "0.35rem", color: "#4b5563" }}>
              {log.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          </div>
        )}

        {success && (
          <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", color: "#065F46", fontSize: "0.8rem", fontWeight: 700 }}>
            ✓ Success! Go to your <a href="/admin/dashboard" style={{ textDecoration: "underline" }}>Admin Dashboard</a> or <a href="/" style={{ textDecoration: "underline" }}>Customer Storefront</a>.
          </div>
        )}
      </div>
    </div>
  );
}
