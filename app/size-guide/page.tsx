"use client";

import Link from "next/link";
import { useState } from "react";

export default function SizeGuide() {
  const [activeTab, setActiveTab] = useState("tshirts");

  return (
    <main style={{ marginTop: "120px", marginBottom: "5rem" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <span className="editorial-caption" style={{ color: "var(--color-brand-red)" }}>CHOOSE YOUR FIT</span>
        <h1 className="display-title" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", marginTop: "0.25rem", marginBottom: "2rem" }}>
          SIZE GUIDE
        </h1>

        <p style={{ color: "var(--color-gray-600)", lineHeight: 1.7, marginBottom: "2.5rem" }}>
          Our silhouettes are cut with custom boxy drops and relaxed shoulders. If you prefer a regular fit, we recommend sizing down one size.
        </p>

        {/* Tab Controls */}
        <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--color-gray-200)", paddingBottom: "1rem", marginBottom: "2rem" }}>
          <button 
            type="button" 
            className={`filter-tag-btn ${activeTab === "tshirts" ? "active" : ""}`}
            style={{
              padding: "0.5rem 1.25rem",
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: "0.75rem",
              letterSpacing: "0.05em",
              border: "1px solid var(--color-gray-300)",
              background: activeTab === "tshirts" ? "var(--color-primary)" : "none",
              color: activeTab === "tshirts" ? "#fff" : "var(--color-primary)",
              cursor: "pointer"
            }}
            onClick={() => setActiveTab("tshirts")}
          >
            T-SHIRTS & HOODIES
          </button>
          <button 
            type="button" 
            className={`filter-tag-btn ${activeTab === "pants" ? "active" : ""}`}
            style={{
              padding: "0.5rem 1.25rem",
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: "0.75rem",
              letterSpacing: "0.05em",
              border: "1px solid var(--color-gray-300)",
              background: activeTab === "pants" ? "var(--color-primary)" : "none",
              color: activeTab === "pants" ? "#fff" : "var(--color-primary)",
              cursor: "pointer"
            }}
            onClick={() => setActiveTab("pants")}
          >
            PANTS & CARGOS
          </button>
        </div>

        {/* Tab Panel: T-Shirts */}
        {activeTab === "tshirts" && (
          <div className="table-responsive">
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", marginBottom: "2rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--color-primary)", fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.8rem", color: "var(--color-gray-500)" }}>
                  <th style={{ padding: "0.75rem" }}>SIZE</th>
                  <th style={{ padding: "0.75rem" }}>CHEST (INCHES)</th>
                  <th style={{ padding: "0.75rem" }}>LENGTH (INCHES)</th>
                  <th style={{ padding: "0.75rem" }}>SLEEVE LENGTH (INCHES)</th>
                </tr>
              </thead>
              <tbody style={{ fontFamily: "var(--font-heading)", fontSize: "0.85rem" }}>
                <tr style={{ borderBottom: "1px solid var(--color-gray-200)" }}>
                  <td style={{ padding: "0.75rem", fontWeight: 800 }}>S</td>
                  <td style={{ padding: "0.75rem" }}>44"</td>
                  <td style={{ padding: "0.75rem" }}>28"</td>
                  <td style={{ padding: "0.75rem" }}>9.5"</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--color-gray-200)" }}>
                  <td style={{ padding: "0.75rem", fontWeight: 800 }}>M</td>
                  <td style={{ padding: "0.75rem" }}>46"</td>
                  <td style={{ padding: "0.75rem" }}>29"</td>
                  <td style={{ padding: "0.75rem" }}>10"</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--color-gray-200)" }}>
                  <td style={{ padding: "0.75rem", fontWeight: 800 }}>L</td>
                  <td style={{ padding: "0.75rem" }}>48"</td>
                  <td style={{ padding: "0.75rem" }}>30"</td>
                  <td style={{ padding: "0.75rem" }}>10.5"</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--color-gray-200)" }}>
                  <td style={{ padding: "0.75rem", fontWeight: 800 }}>XL</td>
                  <td style={{ padding: "0.75rem" }}>50"</td>
                  <td style={{ padding: "0.75rem" }}>31"</td>
                  <td style={{ padding: "0.75rem" }}>11"</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Tab Panel: Pants */}
        {activeTab === "pants" && (
          <div className="table-responsive">
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", marginBottom: "2rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--color-primary)", fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.8rem", color: "var(--color-gray-500)" }}>
                  <th style={{ padding: "0.75rem" }}>SIZE</th>
                  <th style={{ padding: "0.75rem" }}>WAIST (INCHES)</th>
                  <th style={{ padding: "0.75rem" }}>INSEAM (INCHES)</th>
                  <th style={{ padding: "0.75rem" }}>LEG OPENING (INCHES)</th>
                </tr>
              </thead>
              <tbody style={{ fontFamily: "var(--font-heading)", fontSize: "0.85rem" }}>
                <tr style={{ borderBottom: "1px solid var(--color-gray-200)" }}>
                  <td style={{ padding: "0.75rem", fontWeight: 800 }}>S (30)</td>
                  <td style={{ padding: "0.75rem" }}>30"</td>
                  <td style={{ padding: "0.75rem" }}>30"</td>
                  <td style={{ padding: "0.75rem" }}>9.0"</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--color-gray-200)" }}>
                  <td style={{ padding: "0.75rem", fontWeight: 800 }}>M (32)</td>
                  <td style={{ padding: "0.75rem" }}>32"</td>
                  <td style={{ padding: "0.75rem" }}>30.5"</td>
                  <td style={{ padding: "0.75rem" }}>9.5"</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--color-gray-200)" }}>
                  <td style={{ padding: "0.75rem", fontWeight: 800 }}>L (34)</td>
                  <td style={{ padding: "0.75rem" }}>34"</td>
                  <td style={{ padding: "0.75rem" }}>31"</td>
                  <td style={{ padding: "0.75rem" }}>10.0"</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--color-gray-200)" }}>
                  <td style={{ padding: "0.75rem", fontWeight: 800 }}>XL (36)</td>
                  <td style={{ padding: "0.75rem" }}>36"</td>
                  <td style={{ padding: "0.75rem" }}>31.5"</td>
                  <td style={{ padding: "0.75rem" }}>10.5"</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: "3rem" }}>
          <Link href="/shop" className="btn btn-primary">GO TO SHOP</Link>
        </div>
      </div>
    </main>
  );
}
