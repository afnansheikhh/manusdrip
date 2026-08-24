"use client";

import Link from "next/link";

export default function About() {
  return (
    <main style={{ marginTop: "120px", marginBottom: "5rem" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <span className="editorial-caption" style={{ color: "var(--color-brand-red)" }}>THE ARCHITECTS OF STREETWEAR</span>
        <h1 className="display-title" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", marginTop: "0.25rem", marginBottom: "2rem" }}>
          ABOUT MANUSDRIP
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", lineHeight: "1.8", color: "var(--color-gray-600)" }}>
          <p>
            Established in 2026, <strong>ManusDrip</strong> is a contemporary men's streetwear label founded and headquartered in Hospet, Karnataka. We are dedicated to constructing premium, heavyweight streetwear essentials engineered for modern aesthetics, boxy silhouettes, and relaxed fits.
          </p>

          <img 
            src="/images/campaign/drip-philosophy-chair.jpg" 
            alt="ManusDrip Design Philosophy" 
            style={{ width: "100%", height: "400px", objectFit: "cover", margin: "1rem 0" }} 
          />

          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", color: "var(--color-primary)", marginTop: "1rem" }}>
            OUR FIT & FABRIC STANDARDS
          </h2>
          <p>
            Every silhouette we release goes through intense fitting revisions. We select organic cotton fibers spun into high-density <strong>260 GSM double-yarn jersey</strong>. This ensures a boxy drape that resists shrinking, handles high-wear, and maintains its architectural fit wash after wash.
          </p>

          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", color: "var(--color-primary)", marginTop: "1rem" }}>
            HOSPET SHOWROOM COLLECTION
          </h2>
          <p>
            We believe streetwear is an experiential movement. Our flagship Hospet destination invites you to experience our heavyweight fabrics first-hand. Customers can browse our curated catalog online, select sizes, and finalize checkout via WhatsApp for immediate store pickup or local home delivery.
          </p>
        </div>

        <div style={{ marginTop: "3rem", display: "flex", gap: "1rem" }}>
          <Link href="/shop" className="btn btn-primary">SHOP ESSENTIALS</Link>
          <Link href="/contact" className="btn btn-outline">VISIT FLAGSHIP STORE</Link>
        </div>
      </div>
    </main>
  );
}
