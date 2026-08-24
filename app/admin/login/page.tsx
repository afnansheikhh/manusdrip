"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/storeContext";

export default function AdminLogin() {
  const router = useRouter();
  const { settings, loading } = useStore();
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // If already authenticated, redirect straight to dashboard
    const authed = localStorage.getItem("manusdrip_admin_authed");
    if (authed === "true") {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const correctPassword = settings?.admin_password || "Manojkumarkhan";

    if (password === correctPassword) {
      localStorage.setItem("manusdrip_admin_authed", "true");
      router.push("/admin/dashboard");
    } else {
      setErrorMsg("Incorrect admin password. Please try again.");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontFamily: "var(--font-heading)" }}>
        LOADING CONFIG...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b0c10", display: "flex", justifyContent: "center", alignItems: "center", padding: "1.5rem" }}>
      <div style={{ backgroundColor: "#1f2833", width: "100%", maxWidth: "420px", padding: "2.5rem 2rem", borderRadius: "4px", boxShadow: "0 10px 25px rgba(0,0,0,0.5)", border: "1px solid #45f3ff" }}>
        
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img src="/images/logo/logo-white.png" alt="ManusDrip Logo" width="160" height="40" style={{ marginBottom: "1rem" }} />
          <h2 style={{ fontFamily: "var(--font-display)", color: "#fff", fontSize: "1.25rem", fontWeight: 800 }}>
            ADMIN CONTROL PANEL
          </h2>
          <span style={{ fontSize: "0.7rem", color: "#66fcf1", letterSpacing: "0.1em" }}>HOSPET SHOWROOM</span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", color: "#c5a880", fontFamily: "var(--font-heading)", fontSize: "0.75rem", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
              ENTER ADMIN PASSWORD
            </label>
            <input 
              type="password" 
              placeholder="••••••••••••••" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMsg("");
              }}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                backgroundColor: "#0b0c10",
                border: "1px solid #4592af",
                borderRadius: "2px",
                color: "#fff",
                fontFamily: "monospace",
                fontSize: "1rem"
              }}
              required 
            />
          </div>

          {errorMsg && (
            <div style={{ color: "var(--color-brand-red)", fontSize: "0.8rem", fontWeight: 800 }}>
              ✕ {errorMsg}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{
              width: "100%",
              backgroundColor: "#c5a880",
              color: "#111",
              fontWeight: 800,
              padding: "0.85rem",
              borderRadius: "2px"
            }}
          >
            VERIFY ACCESS
          </button>
        </form>
      </div>
    </div>
  );
}
