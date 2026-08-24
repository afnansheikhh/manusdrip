"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/storeContext";
import "./admin.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { settings } = useStore();
  const [authorized, setAuthorized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Skip auth check only on login page
    if (pathname === "/admin/login") {
      setAuthorized(true);
      return;
    }

    const checkAuth = () => {
      const savedAuth = localStorage.getItem("manusdrip_admin_authed");
      if (savedAuth === "true") {
        setAuthorized(true);
      } else {
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Auto-close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (!authorized) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontFamily: "var(--font-heading)", fontWeight: 800 }}>
        VERIFYING SESSION...
      </div>
    );
  }

  // If we are on the login page, render clean container without sidebars
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = () => {
    localStorage.removeItem("manusdrip_admin_authed");
    router.push("/admin/login");
  };

  return (
    <div className="admin-wrapper">
      {/* Admin Sidebar Navigation */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <Link href="/admin/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
            <img src="/images/logo/logo-white.png" alt="ManusDrip Logo" className="sidebar-logo" width="130" height="32" />
            <span className="sidebar-badge">ADMIN</span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <Link href="/admin/dashboard" className={`admin-nav-link ${pathname === "/admin/dashboard" ? "active" : ""}`}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: "20px", height: "20px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Dashboard
          </Link>
          <Link href="/admin/products" className={`admin-nav-link ${pathname?.startsWith("/admin/products") ? "active" : ""}`}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: "20px", height: "20px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            Products
          </Link>
          <Link href="/admin/inventory" className={`admin-nav-link ${pathname === "/admin/inventory" ? "active" : ""}`}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: "20px", height: "20px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
            </svg>
            Inventory
          </Link>
          <Link href="/admin/categories" className={`admin-nav-link ${pathname === "/admin/categories" ? "active" : ""}`}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: "20px", height: "20px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
            </svg>
            Categories
          </Link>
          <Link href="/admin/settings" className={`admin-nav-link ${pathname === "/admin/settings" ? "active" : ""}`}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: "20px", height: "20px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            </svg>
            Settings
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="sidebar-logout-btn" onClick={handleLogout}>
            <svg style={{ width: "18px", height: "18px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            LOG OUT
          </button>
        </div>
      </aside>

      {/* Backdrop overlay for mobile menu */}
      {sidebarOpen && (
        <div 
          className="admin-backdrop-overlay" 
          onClick={() => setSidebarOpen(false)}
          style={{ display: "block", opacity: 0.5, visibility: "visible" }}
        />
      )}

      {/* Main Admin Workspace */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="topbar-left" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button 
              type="button" 
              className="sidebar-toggle-btn" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation"
              style={{ display: "block", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <svg style={{ width: "24px", height: "24px", color: "var(--admin-black)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <h2 className="topbar-title">DASHBOARD</h2>
          </div>
          <div className="topbar-right">
            <Link href="/" target="_blank" className="admin-btn admin-btn-outline admin-btn-sm" style={{ marginRight: "1rem" }}>
              VIEW CUSTOMER SITE ↗
            </Link>
            <div className="user-profile-tag">
              <div className="user-avatar">MD</div>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
