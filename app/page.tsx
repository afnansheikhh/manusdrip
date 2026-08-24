"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/storeContext";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const { products, settings, loading } = useStore();
  const [countdown, setCountdown] = useState({
    days: "07",
    hours: "00",
    minutes: "00",
    seconds: "00",
    isExpired: false
  });

  // Calculate Countdown (Synchronized to launch target)
  useEffect(() => {
    const launchTargetIso = "2026-08-31T23:59:59+05:30";
    const target = new Date(launchTargetIso).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const total = Math.max(0, target - now);

      const seconds = Math.floor((total / 1000) % 60);
      const minutes = Math.floor((total / 1000 / 60) % 60);
      const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
      const days = Math.floor(total / (1000 * 60 * 60 * 24));

      setCountdown({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
        isExpired: total <= 0
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  let featuredProducts = products.filter(p => p.featured && p.status === "active").slice(0, 4);
  if (featuredProducts.length === 0) {
    featuredProducts = products.filter(p => p.status === "active").slice(0, 4);
  }

  // 1. Loading State
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", fontFamily: "var(--font-heading)", fontWeight: 800 }}>
        LOADING COLLECTION...
      </div>
    );
  }

  // 3. Live Active Storefront
  const phone = settings?.whatsapp_number || "916366691845";
  const buyMsg = "Hi ManusDrip! 👋 I'd like to purchase/collect items from the store in Hospet.";
  const waBuyUrl = `https://wa.me/${phone}?text=${encodeURIComponent(buyMsg)}`;

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg">
          <img src="/images/campaign/drip-motion-jorts.jpg" alt="ManusDrip Men's Streetwear Campaign" loading="eager" />
        </div>
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <span className="hero-tagline">MEN'S CLOTHING & STREETWEAR • HOSPET</span>
            <h1 className="display-title hero-title">WEAR YOUR DRIP.</h1>
            <p className="hero-subtitle">
              Contemporary men's streetwear engineered with heavyweight fabrics and boxy drapes in Hospet. Order directly on WhatsApp.
            </p>

            <div className="hero-buttons" style={{ marginTop: "2rem" }}>
              <Link href="/shop" className="btn btn-primary">SHOP COLLECTION</Link>
              <button 
                type="button" 
                className="btn btn-outline-white" 
                onClick={() => window.open(waBuyUrl, "_blank")}
              >
                BUY ON WHATSAPP
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection Section */}
      {featuredProducts.length > 0 && (
        <section className="section-padding" id="featured-collection">
          <div className="container">
            <div className="section-header" style={{ marginBottom: "2.5rem" }}>
              <span className="editorial-caption" style={{ color: "var(--color-brand-red)" }}>DEBUT COLLECTION</span>
              <h2 className="display-title" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", marginTop: "0.25rem" }}>
                DROP 01 • ESSENTIALS
              </h2>
              <p style={{ color: "var(--color-gray-500)", maxWidth: "540px", marginTop: "0.5rem" }}>
                Heavyweight 260 GSM organic cotton, relaxed dropped shoulders, and raw streetwear aesthetics tailored for Hospet.
              </p>
            </div>

            <div className="products-grid">
              {featuredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "3rem" }}>
              <Link href="/shop" className="btn btn-primary">VIEW ALL PIECES</Link>
            </div>
          </div>
        </section>
      )}

      {/* Brand Statement Section */}
      <section className="editorial-statement section-padding">
        <div className="container">
          <div className="statement-grid">
            <div className="statement-content reveal-init revealed">
              <span className="editorial-caption" style={{ color: "var(--color-brand-red)" }}>OUR PHILOSOPHY</span>
              <h2 className="statement-headline">NOT JUST CLOTHES.<br /><span className="highlight-red">IT'S YOUR DRIP.</span></h2>
              <p className="statement-text">
                ManusDrip was founded on the belief that men's everyday streetwear should feel effortless yet uncompromising. Built with heavyweight premium cottons, architectural boxy fits, and timeless streetwear silhouettes that give you total confidence wherever you step.
              </p>
              <Link href="/about" className="btn btn-primary">READ OUR STORY</Link>
            </div>
            <div className="statement-img-wrapper reveal-init revealed">
              <img src="/images/campaign/drip-philosophy-chair.jpg" alt="ManusDrip Streetwear Philosophy" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Hospet Store Info Section */}
      <section className="section-padding" style={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: "820px" }}>
          <span className="editorial-caption" style={{ color: "var(--color-brand-red)" }}>LOCAL FLAGSHIP STORE</span>
          <h2 className="section-title" style={{ color: "var(--color-white)", marginTop: "0.5rem", marginBottom: "1.25rem" }}>
            COMING SOON TO HOSPET
          </h2>
          <p style={{ color: "var(--color-gray-300)", fontSize: "1.125rem", lineHeight: "1.8", marginBottom: "2rem" }}>
            Something new is arriving. A dedicated destination for men's fashion and contemporary streetwear in Hospet. When the first collection drops, browse the catalog online and pick up your pieces directly in store.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="btn btn-white">STORE DETAILS & LOCATION</Link>
            <button 
              type="button" 
              className="btn btn-outline-white" 
              onClick={() => window.open(waBuyUrl, "_blank")}
            >
              GET LAUNCH UPDATES
            </button>
          </div>
        </div>
      </section>

      {/* Lookbook Campaign Section */}
      <section className="lookbook-section section-padding" style={{ backgroundColor: "var(--color-white)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span className="editorial-caption" style={{ color: "var(--color-brand-red)" }}>CAMPAIGN PREVIEW</span>
            <h2 className="section-title" style={{ marginTop: "0.5rem" }}>MEN'S STREETWEAR ARCHIVE</h2>
            <p className="section-subtitle" style={{ maxWidth: "540px", margin: "0 auto" }}>
              A glimpse into the visual direction and styling behind the upcoming ManusDrip drops.
            </p>
          </div>

          <div className="lookbook-grid">
            <div className="lookbook-card reveal-init revealed">
              <img src="/images/campaign/drip-motion-jorts.jpg" alt="Oversized in Motion" loading="lazy" />
              <div className="lookbook-overlay">
                <span className="lookbook-title-tag">DROP 01 PREVIEW</span>
                <h3 className="lookbook-title">OVERSIZED IN MOTION</h3>
                <p className="lookbook-caption">Flannel Vest • Baggy Washed Denim Jorts</p>
              </div>
            </div>

            <div className="lookbook-card reveal-init revealed">
              <img src="/images/campaign/drip-chains-perspective.jpg" alt="Raw Industrial Metallics" loading="lazy" />
              <div className="lookbook-overlay">
                <span className="lookbook-title-tag">METALLICS & CHAINS</span>
                <h3 className="lookbook-title">RAW INDUSTRIAL METALLICS</h3>
                <p className="lookbook-caption">Silver Jewelry Accents • Heavyweight Street Tee</p>
              </div>
            </div>

            <div className="lookbook-card reveal-init revealed">
              <img src="/images/campaign/drip-vintage-bike.jpg" alt="Retro Moto Drip" loading="lazy" />
              <div className="lookbook-overlay">
                <span className="lookbook-title-tag">STREET CULTURE</span>
                <h3 className="lookbook-title">RETRO MOTO DRIP</h3>
                <p className="lookbook-caption">Layered Resort Shirt • Wide-Leg Denim</p>
              </div>
            </div>

            <div className="lookbook-card reveal-init revealed">
              <img src="/images/campaign/drip-architectural-mask.jpg" alt="Neo Street Experimental" loading="lazy" />
              <div className="lookbook-overlay">
                <span className="lookbook-title-tag">AVANT-GARDE EDIT</span>
                <h3 className="lookbook-title">NEO STREET EXPERIMENTAL</h3>
                <p className="lookbook-caption">Architectural Monochrome • Statement Footwear</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter signup section */}
      <section className="newsletter-section section-padding">
        <div className="container">
          <div className="newsletter-box reveal-init revealed">
            <span className="editorial-caption" style={{ color: "var(--color-brand-red)" }}>BE FIRST IN LINE</span>
            <h2 className="section-title" style={{ marginTop: "0.5rem" }}>STAY TUNED FOR DROP 01</h2>
            <p style={{ color: "var(--color-gray-500)", fontSize: "1.05rem" }}>
              Stay updated and get early access notifications when the ManusDrip collection goes live in Hospet.
            </p>
            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert("✓ Thank you! You're on the list."); }}>
              <input type="email" className="newsletter-input" placeholder="Enter your email address" required aria-label="Email address" />
              <button type="submit" className="btn btn-primary">NOTIFY ME</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
