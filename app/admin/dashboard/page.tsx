"use client";

import Link from "next/link";
import { useStore } from "@/lib/storeContext";

export default function AdminDashboard() {
  const { products, settings } = useStore();

  const threshold = settings?.low_stock_threshold || 5;

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === "active").length;

  const lowStockItems: { product: any; size: string; qty: number }[] = [];
  const outOfStockItems: { product: any; size: string }[] = [];

  products.forEach(p => {
    Object.keys(p.stock || {}).forEach(size => {
      const qty = Number(p.stock[size]) || 0;
      if (qty === 0) {
        outOfStockItems.push({ product: p, size });
      } else if (qty <= threshold) {
        lowStockItems.push({ product: p, size, qty });
      }
    });
  });

  return (
    <div>
      <h1 className="admin-page-title" style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "2rem" }}>
        ADMIN DASHBOARD
      </h1>
      <div className="metrics-grid">
        
        <div className="metric-card">
          <div className="metric-card-label">TOTAL PRODUCTS</div>
          <div className="metric-card-value">{totalProducts}</div>
        </div>

        <div className="metric-card metric-success">
          <div className="metric-card-label">ACTIVE PRODUCTS</div>
          <div className="metric-card-value">{activeProducts}</div>
        </div>

        <div className="metric-card metric-warning">
          <div className="metric-card-label">LOW STOCK</div>
          <div className="metric-card-value">{lowStockItems.length}</div>
        </div>

        <div className="metric-card metric-danger">
          <div className="metric-card-label">OUT OF STOCK</div>
          <div className="metric-card-value">{outOfStockItems.length}</div>
        </div>

      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", flexWrap: "wrap" }}>
        
        {/* Low Stock Alerts */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "4px", padding: "1.5rem" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111", borderBottom: "1px solid #f3f4f6", paddingBottom: "0.75rem", marginBottom: "1rem" }}>
            ⚠️ LOW STOCK ALERTS (QTY &lt;= {threshold})
          </h3>
          {lowStockItems.length > 0 ? (
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e5e7eb", color: "#6b7280" }}>
                    <th style={{ padding: "0.5rem" }}>PRODUCT</th>
                    <th style={{ padding: "0.5rem" }}>SIZE</th>
                    <th style={{ padding: "0.5rem" }}>STOCK</th>
                    <th style={{ padding: "0.5rem" }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "0.5rem", fontWeight: 800 }}>{item.product.name}</td>
                      <td style={{ padding: "0.5rem" }}>{item.size}</td>
                      <td style={{ padding: "0.5rem", color: "#f59e0b", fontWeight: 800 }}>{item.qty} left</td>
                      <td style={{ padding: "0.5rem" }}>
                        <Link href={`/admin/products/edit/${item.product.id}`} style={{ textDecoration: "underline", color: "var(--color-primary)" }}>Edit</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>All sizes are healthy.</p>
          )}
        </div>

        {/* Out of Stock Alerts */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "4px", padding: "1.5rem" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111", borderBottom: "1px solid #f3f4f6", paddingBottom: "0.75rem", marginBottom: "1rem" }}>
            ❌ OUT OF STOCK ITEMS
          </h3>
          {outOfStockItems.length > 0 ? (
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e5e7eb", color: "#6b7280" }}>
                    <th style={{ padding: "0.5rem" }}>PRODUCT</th>
                    <th style={{ padding: "0.5rem" }}>SIZE</th>
                    <th style={{ padding: "0.5rem" }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {outOfStockItems.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "0.5rem", fontWeight: 800 }}>{item.product.name}</td>
                      <td style={{ padding: "0.5rem", color: "#ef4444" }}>{item.size}</td>
                      <td style={{ padding: "0.5rem" }}>
                        <Link href={`/admin/products/edit/${item.product.id}`} style={{ textDecoration: "underline", color: "var(--color-primary)" }}>Edit</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>No sizes are currently sold out.</p>
          )}
        </div>

      </div>
    </div>
  );
}
