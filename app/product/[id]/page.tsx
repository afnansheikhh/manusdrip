"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/storeContext";
import ProductCard from "@/components/ProductCard";

export default function ProductDetails() {
  const { id } = useParams() as { id: string };
  const { products, settings, loading, addToCart } = useStore();
  const [product, setProduct] = useState<any>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("Pitch Black");
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("details");

  // Find product by id
  useEffect(() => {
    if (products.length > 0) {
      const found = products.find(p => p.id === id);
      if (found) {
        setProduct(found);
        if (found.sizes?.length > 0) {
          setSelectedSize(found.sizes[0]);
        }
      }
    }
  }, [products, id]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", fontFamily: "var(--font-heading)", fontWeight: 800 }}>
        LOADING PRODUCT...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "8rem 2rem", minHeight: "60vh" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}>PRODUCT NOT FOUND</h2>
        <p style={{ color: "var(--color-gray-500)", marginTop: "0.5rem" }}>The product you are looking for does not exist or has been removed.</p>
        <Link href="/shop" className="btn btn-primary" style={{ marginTop: "1.5rem", display: "inline-block" }}>BACK TO CATALOG</Link>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : ["/images/logo/logo.png"];
  const sizeStock = product.stock || {};
  const currentSizeStock = sizeStock[selectedSize] !== undefined ? Number(sizeStock[selectedSize]) : 0;
  const isSoldOut = product.status === "SOLD_OUT" || product.status === "SOLD OUT" || currentSizeStock === 0;

  // Related Products
  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category && p.status === "active")
    .slice(0, 4);

  // WhatsApp Message Generation
  const refId = `MD-${product.id}-${selectedSize}`;
  const whatsappNumber = settings?.whatsapp_number || "916366691845";
  const checkoutMsg = `Hi ManusDrip! 👋

I'd like to purchase/collect this item:

Product: ${product.name} (Ref: ${refId})
Size: ${selectedSize}
Color: ${selectedColor}
Quantity: ${quantity}
Price: ₹${product.price.toLocaleString()}

I'm in Hospet and would like to collect it from the store. Please confirm availability. Thanks!`;
  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(checkoutMsg)}`;

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  return (
    <main style={{ marginTop: "120px", marginBottom: "5rem" }}>
      <div className="container">
        
        {/* Breadcrumbs */}
        <div className="pdp-breadcrumbs" id="pdpBreadcrumbs" style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-gray-500)", marginBottom: "2.5rem" }}>
          <Link href="/">Home</Link> / <Link href={`/shop?category=${product.category}`}>{product.category}</Link> / <span style={{ color: "var(--color-primary)" }}>{product.name}</span>
        </div>

        <div className="pdp-grid">
          
          {/* Left Column: Image Slider / Gallery */}
          <div className="pdp-images-wrapper">
            <div className="pdp-main-image-container" style={{ position: "relative", backgroundColor: "var(--color-gray-100)", overflow: "hidden", aspectRatio: "3/4" }}>
              <img 
                src={images[activeImageIdx]} 
                alt={product.name} 
                id="pdpMainImage" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="pdp-thumbnails" id="pdpThumbnails" style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                {images.map((imgUrl: string, idx: number) => (
                  <button 
                    key={idx}
                    type="button" 
                    className={`pdp-thumb ${idx === activeImageIdx ? "active" : ""}`}
                    onClick={() => setActiveImageIdx(idx)}
                    style={{
                      width: "80px",
                      height: "100px",
                      overflow: "hidden",
                      border: idx === activeImageIdx ? "2px solid var(--color-brand-red)" : "1px solid var(--color-gray-300)",
                      padding: 0,
                      cursor: "pointer"
                    }}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Checkout Options */}
          <div className="pdp-details-wrapper">
            <span className="pdp-category" id="pdpCategory" style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.75rem", letterSpacing: "0.05em", color: "var(--color-brand-red)", textTransform: "uppercase" }}>
              Men • {product.category}
            </span>
            <h1 className="pdp-title" id="pdpTitle" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.5rem, 4vw, 2.5rem)", textTransform: "uppercase", lineHeight: 1.1, margin: "0.25rem 0 1rem" }}>
              {product.name}
            </h1>

            {/* Price section */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <span className="pdp-price" id="pdpPrice" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.75rem", color: "var(--color-brand-red)" }}>
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="pdp-original-price" id="pdpOriginalPrice" style={{ textDecoration: "line-through", color: "var(--color-gray-400)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem" }}>
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="pdp-discount" id="pdpDiscount" style={{ backgroundColor: "#FEF2F2", color: "var(--color-brand-red)", fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.7rem", padding: "0.25rem 0.5rem", borderRadius: "2px" }}>
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="pdp-description" id="pdpDescription" style={{ color: "var(--color-gray-600)", lineHeight: 1.6, marginBottom: "2rem" }}>
              {product.description}
            </p>

            {/* Color Select */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.75rem", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                <span>SELECT COLOR</span>
                <span id="selectedColorName" style={{ color: "var(--color-gray-500)" }}>{selectedColor}</span>
              </div>
              <div className="pdp-colors" id="pdpColors" style={{ display: "flex", gap: "0.75rem" }}>
                <button 
                  type="button" 
                  className="pdp-color-btn active" 
                  style={{ backgroundColor: "#111111", width: "34px", height: "34px", borderRadius: "50%", border: "2px solid var(--color-brand-red)", cursor: "pointer" }}
                  title="Pitch Black"
                />
              </div>
            </div>

            {/* Size Select */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.75rem", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                <span>SELECT SIZE</span>
                <span>
                  <Link href="/size-guide" style={{ textDecoration: "underline", color: "var(--color-gray-500)" }}>SIZE GUIDE</Link>
                </span>
              </div>
              <div className="pdp-sizes" id="pdpSizes" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {(product.sizes || ["S", "M", "L", "XL"]).map((size: string) => {
                  const stock = sizeStock[size] !== undefined ? Number(sizeStock[size]) : 0;
                  const isOOS = stock === 0;
                  return (
                    <button
                      key={size}
                      type="button"
                      className={`pdp-size-btn ${selectedSize === size ? "active" : ""} ${isOOS ? "out-of-stock" : ""}`}
                      onClick={() => setSelectedSize(size)}
                      disabled={isOOS}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stock status indicator */}
            <div style={{ marginBottom: "1.5rem" }}>
              {isSoldOut ? (
                <span className="admin-badge badge-out-stock">OUT OF STOCK</span>
              ) : currentSizeStock <= (settings?.low_stock_threshold || 5) ? (
                <span className="admin-badge badge-low-stock">ONLY {currentSizeStock} PIECES LEFT</span>
              ) : (
                <span className="admin-badge badge-in-stock">IN STOCK (HOSPET STORE)</span>
              )}
            </div>

            {/* Quantity Stepper */}
            {!isSoldOut && (
              <div style={{ marginBottom: "2rem" }}>
                <span style={{ display: "block", fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.75rem", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                  QUANTITY
                </span>
                <div className="qty-stepper">
                  <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <input type="number" value={quantity} readOnly />
                  <button type="button" onClick={() => setQuantity(Math.min(currentSizeStock, quantity + 1))}>+</button>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {isSoldOut ? (
                <button type="button" className="btn btn-primary w-100" style={{ cursor: "not-allowed", opacity: 0.6 }} disabled>
                  SOLD OUT
                </button>
              ) : (
                <>
                  <button 
                    type="button" 
                    className="btn btn-whatsapp w-100"
                    onClick={() => window.open(waUrl, "_blank")}
                  >
                    BUY ON WHATSAPP
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline w-100"
                    onClick={() => addToCart(product, selectedSize, selectedColor, quantity)}
                  >
                    ADD TO BAG
                  </button>
                </>
              )}
            </div>

            {/* Accordions */}
            <div className="pdp-accordions" style={{ marginTop: "3rem", borderTop: "1px solid var(--color-gray-200)" }}>
              {/* Details */}
              <div className="accordion-item" style={{ borderBottom: "1px solid var(--color-gray-200)" }}>
                <button type="button" className="accordion-header" onClick={() => toggleAccordion("details")}>
                  DETAILS
                </button>
                <div className={`accordion-panel ${activeAccordion === "details" ? "active" : ""}`} style={{ display: activeAccordion === "details" ? "block" : "none" }}>
                  <ul style={{ listStyle: "disc", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <li>Heavyweight Organic Combed Cotton</li>
                    <li>Signature boxy oversized fit</li>
                    <li>Reinforced high-density ribbed collar</li>
                    <li>Pre-shrunk fabric to prevent shrinkage</li>
                  </ul>
                </div>
              </div>

              {/* Care */}
              <div className="accordion-item" style={{ borderBottom: "1px solid var(--color-gray-200)" }}>
                <button type="button" className="accordion-header" onClick={() => toggleAccordion("care")}>
                  CARE INSTRUCTIONS
                </button>
                <div className={`accordion-panel ${activeAccordion === "care" ? "active" : ""}`} style={{ display: activeAccordion === "care" ? "block" : "none" }}>
                  <ul style={{ listStyle: "disc", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <li>Machine wash cold inside-out (30°C)</li>
                    <li>Do not bleach or tumble dry</li>
                    <li>Iron low on reverse side</li>
                  </ul>
                </div>
              </div>

              {/* Shipping */}
              <div className="accordion-item" style={{ borderBottom: "1px solid var(--color-gray-200)" }}>
                <button type="button" className="accordion-header" onClick={() => toggleAccordion("shipping")}>
                  COLLECTION & PURCHASING
                </button>
                <div className={`accordion-panel ${activeAccordion === "shipping" ? "active" : ""}`} style={{ display: activeAccordion === "shipping" ? "block" : "none" }}>
                  <p>
                    Direct WhatsApp order inquiry. Contact our store team to confirm sizes, stock availability, and collect directly at our Hospet showroom.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <section className="section-padding" style={{ borderTop: "1px solid var(--color-gray-200)", marginTop: "5rem" }}>
            <span className="editorial-caption" style={{ color: "var(--color-brand-red)" }}>YOU MAY ALSO LIKE</span>
            <h2 className="display-title" style={{ fontSize: "2rem", marginTop: "0.25rem", marginBottom: "2.5rem" }}>
              RELATED PIECES
            </h2>
            <div className="products-grid">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
