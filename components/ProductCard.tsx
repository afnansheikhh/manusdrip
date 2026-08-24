"use client";

import Link from "next/link";
import { useStore } from "@/lib/storeContext";
import { Product } from "@/lib/dbService";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist, addToCart } = useStore();

  const isWishlisted = isInWishlist(product.id);
  const totalStock = Object.values(product.stock || {}).reduce((sum, q) => sum + (Number(q) || 0), 0);
  const isSoldOut = product.status === "SOLD_OUT" || product.status === "SOLD OUT" || totalStock === 0;

  // Image Fallbacks
  const primaryImg = product.images?.[0] || "/images/logo/logo.png";
  const secondaryImg = product.images?.[1] || primaryImg;

  let badgeHTML = null;
  if (isSoldOut) {
    badgeHTML = <span className="product-badge" style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}>SOLD OUT</span>;
  } else if (product.newArrival) {
    badgeHTML = <span className="product-badge badge-new">NEW DROP</span>;
  } else if (product.bestseller) {
    badgeHTML = <span className="product-badge">BESTSELLER</span>;
  }

  return (
    <article className="product-card" data-product-id={product.id}>
      <div className="product-thumb-wrapper">
        <Link href={`/product/${product.id}`} aria-label={`View ${product.name}`}>
          <img src={primaryImg} alt={product.name} className="product-img-primary" loading="lazy" />
          <img src={secondaryImg} alt={`${product.name} alternate view`} className="product-img-secondary" loading="lazy" />
        </Link>
        {badgeHTML}
        
        {/* Wishlist Button */}
        <button 
          type="button" 
          className={`product-wishlist-btn ${isWishlisted ? "active" : ""}`}
          onClick={() => toggleWishlist(product.id)}
          aria-label="Add to wishlist"
        >
          <svg style={{ width: "18px", height: "18px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Quick Add overlay */}
        <div className="product-quick-add">
          {isSoldOut ? (
            <button type="button" className="quick-add-btn" style={{ opacity: 0.6, cursor: "not-allowed" }} disabled>
              SOLD OUT
            </button>
          ) : (
            <button 
              type="button" 
              className="quick-add-btn" 
              onClick={() => addToCart(product, product.sizes?.[0] || "M", "Pitch Black", 1)}
            >
              QUICK ADD
            </button>
          )}
        </div>
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h4 className="product-title">
          <Link href={`/product/${product.id}`}>{product.name}</Link>
        </h4>
        <div className="product-price-wrapper">
          <span className="product-price">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="product-original-price">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
        <div className="product-sizes-pill">
          {(product.sizes || ["S", "M", "L", "XL"]).map(s => (
            <span key={s} className="size-pill">{s}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
