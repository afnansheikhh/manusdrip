"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DbService, Product } from "@/lib/dbService";
import { useStore } from "@/lib/storeContext";

export default function AddProduct() {
  const router = useRouter();
  const { categories, refreshCatalog } = useStore();

  // Form Fields
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("T-Shirts");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [status, setStatus] = useState("active");
  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [bestseller, setBestseller] = useState(false);

  // Images state (Base64 list)
  const [images, setImages] = useState<string[]>([]);
  const [imageFilesCount, setImageFilesCount] = useState(0);

  // Sizes & Stock
  const [stock, setStock] = useState<Record<string, number>>({
    S: 0,
    M: 0,
    L: 0,
    XL: 0
  });

  // Client-side Image compression helper (keeps base64 < 40KB for Firestore documents)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageFilesCount(files.length);

    const promises = Array.from(files).map(file => {
      return new Promise<string | null>((resolve) => {
        if (!file.type.startsWith("image/")) {
          return resolve(null);
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            try {
              const canvas = document.createElement("canvas");
              let width = img.width;
              let height = img.height;
              const maxSize = 600;

              if (width > height) {
                if (width > maxSize) {
                  height = Math.round((height * maxSize) / width);
                  width = maxSize;
                }
              } else {
                if (height > maxSize) {
                  width = Math.round((width * maxSize) / height);
                  height = maxSize;
                }
              }

              canvas.width = width;
              canvas.height = height;

              const ctx = canvas.getContext("2d");
              ctx?.drawImage(img, 0, 0, width, height);

              const compressedBase64 = canvas.toDataURL("image/jpeg", 0.5);
              resolve(compressedBase64);
            } catch (err) {
              console.error("Canvas resizing failed:", err);
              resolve(event.target?.result as string);
            }
          };
          img.onerror = () => {
            resolve(event.target?.result as string);
          };
          img.src = event.target?.result as string;
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });
    });

    const results = await Promise.all(promises);
    setImages(results.filter((img): img is string => img !== null));
  };

  const handleStockChange = (size: string, value: string) => {
    const qty = parseInt(value, 10) || 0;
    setStock(prev => ({
      ...prev,
      [size]: Math.max(0, qty)
    }));
  };

  const handleStepperChange = (size: string, step: number) => {
    setStock(prev => ({
      ...prev,
      [size]: Math.max(0, (prev[size] || 0) + step)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id.trim()) {
      alert("Product ID is required.");
      return;
    }

    const sizes = Object.keys(stock).filter(size => stock[size] > 0 || size === "S" || size === "M" || size === "L" || size === "XL");

    const newProduct: Product = {
      id: id.trim().toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      category,
      price: parseFloat(price) || 0,
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      images,
      sizes,
      stock,
      status,
      featured,
      newArrival,
      bestseller
    };

    console.log("Saving new product:", newProduct);
    const ok = await DbService.addProduct(newProduct);
    if (ok) {
      alert(`Product ${id} created successfully!`);
      refreshCatalog();
      router.push("/admin/products");
    } else {
      alert("Failed to save product to Firestore database.");
    }
  };

  return (
    <div>
      <h1 className="admin-page-title" style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "2rem" }}>
        ADD NEW PRODUCT
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem", flexWrap: "wrap" }}>
        
        {/* Left Column: Core Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Card: Basic Info */}
          <div style={{ backgroundColor: "#fff", padding: "2rem", border: "1px solid #e5e7eb", borderRadius: "4px" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 800, marginBottom: "1.5rem", borderBottom: "1px solid #f3f4f6", paddingBottom: "0.5rem" }}>
              PRODUCT DETAILS
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.5rem", marginBottom: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>PRODUCT ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. MD007" 
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", textTransform: "uppercase" }}
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>PRODUCT NAME</label>
                <input 
                  type="text" 
                  placeholder="e.g. Blue Denim Riot Shirt" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db" }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>DESCRIPTION</label>
              <textarea 
                placeholder="Enter detailed description..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", height: "120px", fontFamily: "sans-serif" }}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>CATEGORY</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", background: "none" }}
                >
                  <option value="T-Shirts">T-Shirts</option>
                  <option value="Shirts">Shirts</option>
                  <option value="Hoodies">Hoodies</option>
                  <option value="Pants">Pants</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>ONLINE STATUS</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", background: "none" }}
                >
                  <option value="active">Active (Visible)</option>
                  <option value="sold_out">Sold Out (Out of Stock)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card: Pricing & Flags */}
          <div style={{ backgroundColor: "#fff", padding: "2rem", border: "1px solid #e5e7eb", borderRadius: "4px" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 800, marginBottom: "1.5rem", borderBottom: "1px solid #f3f4f6", paddingBottom: "0.5rem" }}>
              PRICING & LABELS
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>PRICE (₹)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 999" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db" }}
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>ORIGINAL PRICE (₹) (OPTIONAL)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 1499" 
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", cursor: "pointer" }}>
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                FEATURED IN DEBUT DROP
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", cursor: "pointer" }}>
                <input type="checkbox" checked={newArrival} onChange={(e) => setNewArrival(e.target.checked)} />
                NEW ARRIVAL BADGE
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", cursor: "pointer" }}>
                <input type="checkbox" checked={bestseller} onChange={(e) => setBestseller(e.target.checked)} />
                BESTSELLER LABEL
              </label>
            </div>
          </div>

          {/* Card: Size-wise Inventory */}
          <div style={{ backgroundColor: "#fff", padding: "2rem", border: "1px solid #e5e7eb", borderRadius: "4px" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 800, marginBottom: "1.5rem", borderBottom: "1px solid #f3f4f6", paddingBottom: "0.5rem" }}>
              SIZE-WISE INVENTORY
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {["S", "M", "L", "XL"].map(size => (
                <div key={size} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f3f4f6", paddingBottom: "0.75rem" }}>
                  <span style={{ fontWeight: 800, fontSize: "0.85rem", width: "40px" }}>SIZE {size}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div className="qty-stepper">
                      <button type="button" onClick={() => handleStepperChange(size, -1)}>-</button>
                      <input 
                        type="number" 
                        value={stock[size]} 
                        onChange={(e) => handleStockChange(size, e.target.value)} 
                      />
                      <button type="button" onClick={() => handleStepperChange(size, 1)}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Images Uploader & Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div style={{ backgroundColor: "#fff", padding: "2.0rem 1.5rem", border: "1px solid #e5e7eb", borderRadius: "4px" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 800, marginBottom: "1rem" }}>
              PRODUCT PHOTOS
            </h3>
            
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleImageUpload}
              style={{ fontSize: "0.75rem", width: "100%", marginBottom: "1rem" }}
            />
            
            {images.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
                {images.map((img, idx) => (
                  <div key={idx} style={{ position: "relative", aspectRatio: "3/4", backgroundColor: "#f3f4f6" }}>
                    <img src={img} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: "0.75rem", color: "#6b7280", textAlign: "center", padding: "2rem 0", border: "2px dashed #e5e7eb" }}>
                Select images. They will be compressed automatically on upload.
              </p>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <button type="submit" className="btn btn-primary w-100" style={{ padding: "0.85rem" }}>
              SAVE PRODUCT
            </button>
            <button 
              type="button" 
              className="btn btn-outline w-100" 
              onClick={() => router.push("/admin/products")}
              style={{ padding: "0.85rem" }}
            >
              CANCEL
            </button>
          </div>

        </div>

      </form>
    </div>
  );
}
