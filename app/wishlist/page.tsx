"use client";

import Link from "next/link";
import { useStore } from "@/lib/storeContext";
import ProductCard from "@/components/ProductCard";

export default function Wishlist() {
  const { products, wishlist, loading } = useStore();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", fontFamily: "var(--font-heading)", fontWeight: 800 }}>
        LOADING WISHLIST...
      </div>
    );
  }

  const wishlistedItems = products.filter(p => wishlist.includes(p.id) && p.status === "active");

  return (
    <main style={{ marginTop: "120px", marginBottom: "5rem" }}>
      <div className="container">
        <span className="editorial-caption" style={{ color: "var(--color-brand-red)" }}>YOUR CURATED ARCHIVE</span>
        <h1 className="display-title" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", marginTop: "0.25rem", marginBottom: "2.5rem" }}>
          YOUR WISHLIST
        </h1>

        {wishlistedItems.length > 0 ? (
          <div className="products-grid">
            {wishlistedItems.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
            <svg style={{ width: "48px", height: "48px", color: "var(--color-gray-300)", margin: "0 auto 1.5rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem" }}>YOUR WISHLIST IS EMPTY</h3>
            <p style={{ color: "var(--color-gray-500)", marginTop: "0.5rem" }}>
              Keep track of items you like. Click the heart icon on any product card to save them here.
            </p>
            <Link href="/shop" className="btn btn-primary" style={{ marginTop: "1.5rem", display: "inline-block" }}>
              DISCOVER PIECES
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
