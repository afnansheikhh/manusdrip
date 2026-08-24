"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/storeContext";
import { useEffect, useState } from "react";
import { isFirebaseConfigured } from "@/lib/firebase";

export default function Header() {
  const pathname = usePathname();
  const { cart, wishlist, setCartOpen, setMobileNavOpen, setSearchOpen, settings } = useStore();
  const [scrolled, setScrolled] = useState(false);

  // Announcement Bar Text Setup
  const announcementText = "MANUSDRIP • MEN'S STREETWEAR FLAGSHIP • HOSPET • ORDER DIRECTLY ON WHATSAPP";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalWishlistItems = wishlist.length;

  // If path is admin path, do not render public header
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <span>
          {announcementText.split(" • ").map((part, idx, arr) => (
            <span key={idx}>
              {part}
              {idx < arr.length - 1 && " • "}
            </span>
          ))}
        </span>
      </div>

      {/* Demo Warning Banner */}
      {!isFirebaseConfigured && (
        <div style={{ backgroundColor: "#ef4444", color: "#fff", textAlign: "center", padding: "0.4rem 1rem", fontSize: "0.72rem", fontFamily: "var(--font-heading)", fontWeight: 800, letterSpacing: "0.05em" }}>
          ⚠️ RUNNING IN LOCAL DEMO MODE. CONFIGURE YOUR FIREBASE CREDENTIALS IN .env.local TO ENABLE FIRESTORE CLOUD DATABASE.
        </div>
      )}

      {/* Header */}
      <header className={`site-header ${scrolled ? "scrolled" : ""}`} id="siteHeader">
        <div className="container header-container">
          {/* Left: Brand Logo */}
          <Link href="/" className="header-logo" aria-label="ManusDrip Home">
            <img src="/images/logo/logo.png" alt="ManusDrip Logo" width="180" height="44" />
          </Link>

          {/* Center: Clean Desktop Navigation */}
          <nav className="desktop-nav" aria-label="Main Navigation">
            <ul className="nav-list">
              <li>
                <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
                  HOME
                </Link>
              </li>
              <li>
                <Link href="/shop" className={`nav-link ${pathname === "/shop" ? "active" : ""}`}>
                  SHOP
                </Link>
              </li>
              <li>
                <Link href="/about" className={`nav-link ${pathname === "/about" ? "active" : ""}`}>
                  ABOUT
                </Link>
              </li>
              <li>
                <Link href="/contact" className={`nav-link ${pathname === "/contact" ? "active" : ""}`}>
                  CONTACT
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right: Action Icons */}
          <div className="header-actions">
            {/* Search */}
            <button 
              className="action-btn" 
              onClick={() => setSearchOpen(true)} 
              aria-label="Search"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: "24px", height: "24px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="action-btn" aria-label="View Wishlist" style={{ position: "relative" }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: "24px", height: "24px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {totalWishlistItems > 0 && (
                <span className="badge-count wishlist-count-badge" style={{ display: "flex" }}>
                  {totalWishlistItems}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button 
              className="action-btn cart-toggle-btn" 
              onClick={() => setCartOpen(true)} 
              aria-label="Open cart"
              style={{ position: "relative" }}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: "24px", height: "24px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalCartItems > 0 && (
                <span className="badge-count cart-count-badge" style={{ display: "flex" }}>
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button 
              className="action-btn hamburger-btn" 
              onClick={() => setMobileNavOpen(true)} 
              aria-label="Open mobile menu"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: "24px", height: "24px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
