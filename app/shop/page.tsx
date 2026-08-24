"use client";

import { useState } from "react";
import { useStore } from "@/lib/storeContext";
import ProductCard from "@/components/ProductCard";

export default function Shop() {
  const { products, settings, loading } = useStore();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", fontFamily: "var(--font-heading)", fontWeight: 800 }}>
        LOADING COLLECTION...
      </div>
    );
  }

  // Filter & Sort logic
  let filtered = products.filter(p => p.status === "active");

  if (selectedCategory !== "all") {
    filtered = filtered.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  if (sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  const categoriesList = ["all", "T-Shirts", "Shirts", "Hoodies", "Pants"];

  return (
    <main style={{ marginTop: "80px" }}>
      {/* Shop Hero Header */}
      <section className="shop-header-section" style={{ padding: "4rem 0 2rem", borderBottom: "1px solid var(--color-gray-200)" }}>
        <div className="container">
          <span className="editorial-caption" style={{ color: "var(--color-brand-red)" }}>MANUSDRIP ARCHIVE</span>
          <h1 className="display-title" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", marginTop: "0.25rem" }}>
            SHOP COLLECTION
          </h1>
          <p style={{ color: "var(--color-gray-500)", maxWidth: "600px", marginTop: "0.5rem" }}>
            Contemporary men's streetwear. Heavyweight organic fabrics, architectural drapes, and boxy fits designed and collected directly in Hospet.
          </p>
        </div>
      </section>

      {/* Catalog Filters & Search toolbar */}
      <section style={{ padding: "2rem 0", borderBottom: "1px solid var(--color-gray-100)" }}>
        <div className="container" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          
          {/* Categories select tags */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {categoriesList.map(cat => (
              <button
                key={cat}
                type="button"
                className={`filter-tag-btn ${selectedCategory === cat ? "active" : ""}`}
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  letterSpacing: "0.05em",
                  padding: "0.5rem 1rem",
                  border: "1px solid var(--color-gray-300)",
                  background: selectedCategory === cat ? "var(--color-primary)" : "none",
                  color: selectedCategory === cat ? "var(--color-white)" : "var(--color-primary)",
                  cursor: "pointer",
                  textTransform: "uppercase"
                }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort select */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", flex: "1", justifyContent: "flex-end", maxWidth: "600px" }}>
            <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
              <input
                type="text"
                placeholder="Search collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem 1rem",
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.75rem",
                  border: "1px solid var(--color-gray-300)"
                }}
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "0.5rem 1rem",
                fontFamily: "var(--font-heading)",
                fontSize: "0.75rem",
                border: "1px solid var(--color-gray-300)",
                background: "none"
              }}
            >
              <option value="default">SORT BY</option>
              <option value="price-low">PRICE: LOW TO HIGH</option>
              <option value="price-high">PRICE: HIGH TO LOW</option>
            </select>
          </div>

        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding" style={{ minHeight: "50vh" }}>
        <div className="container">
          <div id="shopProductCount" style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.8rem", color: "var(--color-gray-500)", marginBottom: "2rem" }}>
            SHOWING {filtered.length} STYLES
          </div>

          {filtered.length > 0 ? (
            <div className="products-grid">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem" }}>NO PIECES FOUND</h3>
              <p style={{ color: "var(--color-gray-500)", marginTop: "0.5rem" }}>Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
