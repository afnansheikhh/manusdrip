"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/storeContext";

export default function Drawers() {
  const { 
    cart, 
    cartOpen, 
    setCartOpen, 
    mobileNavOpen, 
    setMobileNavOpen, 
    searchOpen, 
    setSearchOpen, 
    updateCartQty, 
    removeFromCart, 
    checkoutWhatsApp, 
    products 
  } = useStore();

  const [searchQuery, setSearchQuery] = useState("");

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const filteredProducts = searchQuery.trim()
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      {/* Drawer Backdrop */}
      {(cartOpen || mobileNavOpen || searchOpen) && (
        <div 
          className="drawer-backdrop active" 
          id="drawerBackdrop" 
          onClick={() => {
            setCartOpen(false);
            setMobileNavOpen(false);
            setSearchOpen(false);
          }}
        />
      )}

      {/* Cart Slide-Out Drawer */}
      <aside className={`side-drawer ${cartOpen ? "active" : ""}`} id="cartDrawer" aria-label="Shopping Cart">
        <div className="drawer-header">
          <h3 className="drawer-title">YOUR CART</h3>
          <button className="drawer-close-btn" onClick={() => setCartOpen(false)} aria-label="Close cart">
            <svg style={{ width: "20px", height: "20px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="drawer-body" id="cartDrawerItems">
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 1.5rem" }}>
              <svg style={{ width: "48px", height: "48px", color: "var(--color-gray-300)", margin: "0.5rem auto 1rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                YOUR CART IS EMPTY
              </h4>
              <p style={{ color: "var(--color-gray-500)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Browse our collection and add heavyweight streetwear essentials to your bag.
              </p>
              <button className="btn btn-primary btn-sm" onClick={() => setCartOpen(false)}>
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item, idx) => (
                <div className="cart-item" key={`${item.id}-${item.size}-${item.color}`}>
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div style={{ flex: 1 }}>
                    <h5 className="cart-item-title">{item.name}</h5>
                    <div className="cart-item-meta">
                      Size: <strong>{item.size}</strong> | Color: <strong>{item.color}</strong>
                    </div>
                    <div className="cart-item-price">₹{item.price.toLocaleString()}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem" }}>
                      <div className="qty-stepper" style={{ transform: "scale(0.95)", transformOrigin: "left" }}>
                        <button type="button" onClick={() => updateCartQty(idx, item.quantity - 1)}>-</button>
                        <input type="number" value={item.quantity} readOnly />
                        <button type="button" onClick={() => updateCartQty(idx, item.quantity + 1)}>+</button>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeFromCart(idx)} 
                        style={{ color: "var(--color-brand-red)", background: "none", border: "none", fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.75rem", cursor: "pointer", letterSpacing: "0.05em" }}
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-footer" id="cartDrawerFooter" style={{ display: "block" }}>
            <div className="cart-subtotal-row">
              <span className="label">SUBTOTAL</span>
              <span className="value" id="cartDrawerSubtotal">₹{subtotal.toLocaleString()}</span>
            </div>
            <p className="cart-checkout-notice">
              Direct self-collection in Hospet. Direct WhatsApp order routing.
            </p>
            <button 
              type="button" 
              className="btn btn-primary w-100" 
              onClick={() => {
                checkoutWhatsApp();
                setCartOpen(false);
              }}
            >
              ORDER VIA WHATSAPP
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Navigation Drawer */}
      <aside className={`side-drawer drawer-left ${mobileNavOpen ? "active" : ""}`} id="mobileNavDrawer" aria-label="Mobile Navigation">
        <div className="drawer-header">
          <img src="/images/logo/logo.png" alt="ManusDrip Logo" width="140" height="34" />
          <button className="drawer-close-btn" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation">
            <svg style={{ width: "20px", height: "20px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="drawer-body">
          <ul style={{ display: "flex", flexDirection: "column", gap: "1.5rem", fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 800, textTransform: "uppercase" }}>
            <li><Link href="/" onClick={() => setMobileNavOpen(false)}>HOME</Link></li>
            <li><Link href="/shop" onClick={() => setMobileNavOpen(false)}>SHOP COLLECTION</Link></li>
            <li><Link href="/about" onClick={() => setMobileNavOpen(false)}>ABOUT MANUSDRIP</Link></li>
            <li><Link href="/size-guide" onClick={() => setMobileNavOpen(false)}>SIZE GUIDE</Link></li>
            <li><Link href="/contact" onClick={() => setMobileNavOpen(false)}>HOSPET STORE & HELP</Link></li>
          </ul>
        </div>
      </aside>

      {/* Global Search Modal */}
      <div className={`search-modal ${searchOpen ? "active" : ""}`} id="searchModal" aria-label="Product Search Modal">
        <div className="search-input-wrapper">
          <svg style={{ width: "24px", height: "24px", color: "var(--color-gray-500)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            className="search-main-input" 
            id="globalSearchInput" 
            placeholder="SEARCH OVERSIZED TEES, HOODIES, PANTS..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off" 
          />
          <button className="action-btn" onClick={() => setSearchOpen(false)} aria-label="Close search">
            <svg style={{ width: "24px", height: "24px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="search-results-box" id="searchResultsList" style={{ display: searchQuery ? "block" : "none" }}>
          {filteredProducts.length > 0 ? (
            <div className="search-results-grid">
              {filteredProducts.map(p => (
                <Link 
                  href={`/product/${p.id}`} 
                  key={p.id} 
                  className="search-result-item" 
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                >
                  <img src={p.images[0] || "/images/logo/logo.png"} alt={p.name} className="search-result-img" />
                  <div>
                    <h5 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.95rem" }}>{p.name}</h5>
                    <span style={{ fontSize: "0.8rem", color: "var(--color-gray-500)" }}>{p.category} • ₹{p.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center", padding: "2rem", color: "var(--color-gray-500)" }}>
              No products found matching "{searchQuery}"
            </p>
          )}
        </div>
      </div>
    </>
  );
}
