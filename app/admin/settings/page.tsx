"use client";

import React, { useEffect, useState } from "react";
import { useStore } from "@/lib/storeContext";
import { DbService } from "@/lib/dbService";

export default function AdminSettings() {
  const { settings, refreshCatalog } = useStore();

  const [storeName, setStoreName] = useState("");
  const [city, setCity] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [launchMode, setLaunchMode] = useState("LIVE");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");
  const [adminPassword, setAdminPassword] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setStoreName(settings.store_name || "");
      setCity(settings.city || "");
      setWhatsappNumber(settings.whatsapp_number || "");
      setStoreAddress(settings.store_address || "");
      setInstagramUrl(settings.instagram_url || "");
      setLaunchMode(settings.launch_mode || "LIVE");
      setLowStockThreshold(String(settings.low_stock_threshold || 5));
      setAdminPassword(settings.admin_password || "");
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      store_name: storeName.trim(),
      city: city.trim(),
      whatsapp_number: whatsappNumber.replace(/\D/g, ""),
      store_address: storeAddress.trim(),
      instagram_url: instagramUrl.trim(),
      launch_mode: launchMode,
      low_stock_threshold: parseInt(lowStockThreshold, 10) || 5,
      admin_password: adminPassword
    };

    const ok = await DbService.updateSettings(payload);
    setSaving(false);
    if (ok) {
      alert("Settings saved successfully to Firestore.");
      refreshCatalog();
    } else {
      alert("Failed to save settings.");
    }
  };

  return (
    <div style={{ maxWidth: "700px" }}>
      <h1 className="admin-page-title" style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "2rem" }}>
        STORE SETTINGS
      </h1>

      <div style={{ backgroundColor: "#fff", padding: "2.5rem 2rem", border: "1px solid #e5e7eb", borderRadius: "4px" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <h3 style={{ fontSize: "0.95rem", fontWeight: 800, borderBottom: "1px solid #f3f4f6", paddingBottom: "0.5rem" }}>
            GENERAL CONFIGURATION
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>STORE NAME</label>
              <input 
                type="text" 
                value={storeName} 
                onChange={(e) => setStoreName(e.target.value)}
                style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db" }}
                required 
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>CITY</label>
              <input 
                type="text" 
                value={city} 
                onChange={(e) => setCity(e.target.value)}
                style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db" }}
                required 
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>LAUNCH MODE</label>
              <select 
                value={launchMode}
                onChange={(e) => setLaunchMode(e.target.value)}
                style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", background: "none" }}
              >
                <option value="LIVE">Live Online Store Catalog</option>
                <option value="COMING_SOON">Coming Soon (Countdown Landing Page)</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>LOW STOCK THRESHOLD</label>
              <input 
                type="number" 
                value={lowStockThreshold} 
                onChange={(e) => setLowStockThreshold(e.target.value)}
                style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db" }}
                required 
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>WHATSAPP CHECKOUT PHONE NUMBER</label>
            <input 
              type="text" 
              value={whatsappNumber} 
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="e.g. 916366691845"
              style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db" }}
              required 
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>INSTAGRAM URL</label>
            <input 
              type="url" 
              value={instagramUrl} 
              onChange={(e) => setInstagramUrl(e.target.value)}
              style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db" }}
              required 
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>STORE ADDRESS</label>
            <textarea 
              value={storeAddress} 
              onChange={(e) => setStoreAddress(e.target.value)}
              style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", height: "80px", fontFamily: "sans-serif" }}
              required 
            />
          </div>

          <h3 style={{ fontSize: "0.95rem", fontWeight: 800, borderBottom: "1px solid #f3f4f6", paddingBottom: "0.5rem", marginTop: "1rem" }}>
            ADMIN ACCESS SECURITY
          </h3>

          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>ADMIN PASSWORD</label>
            <input 
              type="text" 
              value={adminPassword} 
              onChange={(e) => setAdminPassword(e.target.value)}
              style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db" }}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ padding: "0.85rem", marginTop: "1rem" }}
            disabled={saving}
          >
            {saving ? "SAVING CONFIGURATION..." : "SAVE SETTINGS"}
          </button>

        </form>
      </div>
    </div>
  );
}
