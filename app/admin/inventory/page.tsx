"use client";

import React, { useEffect, useState } from "react";
import { useStore } from "@/lib/storeContext";
import { DbService } from "@/lib/dbService";

export default function AdminInventory() {
  const { products, refreshCatalog } = useStore();
  const [localStock, setLocalStock] = useState<Record<string, Record<string, number>>>({});

  // Sync local changes state with catalog
  useEffect(() => {
    const stockMap: Record<string, Record<string, number>> = {};
    products.forEach(p => {
      stockMap[p.id] = {
        S: p.stock?.S !== undefined ? Number(p.stock.S) : 0,
        M: p.stock?.M !== undefined ? Number(p.stock.M) : 0,
        L: p.stock?.L !== undefined ? Number(p.stock.L) : 0,
        XL: p.stock?.XL !== undefined ? Number(p.stock.XL) : 0
      };
    });
    setLocalStock(stockMap);
  }, [products]);

  const handleInputChange = (productId: string, size: string, val: string) => {
    const num = parseInt(val, 10) || 0;
    setLocalStock(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [size]: Math.max(0, num)
      }
    }));
  };

  const handleSaveRow = async (productId: string) => {
    const rowStock = localStock[productId];
    if (!rowStock) return;

    const ok = await DbService.updateProduct(productId, { stock: rowStock });
    if (ok) {
      alert(`Stock counts for product ${productId} updated successfully.`);
      refreshCatalog();
    } else {
      alert("Failed to update stock counts.");
    }
  };

  return (
    <div>
      <h1 className="admin-page-title" style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "2rem" }}>
        INVENTORY STOCK GRID
      </h1>

      <div className="table-responsive" style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "4px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#f9fafb", borderBottom: "2px solid #e5e7eb", color: "#4b5563", fontFamily: "var(--font-heading)", fontWeight: 800 }}>
              <th style={{ padding: "1rem" }}>PRODUCT ID</th>
              <th style={{ padding: "1rem" }}>NAME</th>
              <th style={{ padding: "1rem", textAlign: "center" }}>SIZE S</th>
              <th style={{ padding: "1rem", textAlign: "center" }}>SIZE M</th>
              <th style={{ padding: "1rem", textAlign: "center" }}>SIZE L</th>
              <th style={{ padding: "1rem", textAlign: "center" }}>SIZE XL</th>
              <th style={{ padding: "1rem" }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map(p => {
                const rowStock = localStock[p.id] || { S: 0, M: 0, L: 0, XL: 0 };
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "1rem", fontWeight: 800 }}>{p.id}</td>
                    <td style={{ padding: "1rem", fontWeight: 800 }}>{p.name}</td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <input 
                        type="number" 
                        value={rowStock.S}
                        onChange={(e) => handleInputChange(p.id, "S", e.target.value)}
                        style={{ width: "60px", padding: "0.4rem", textAlign: "center", border: "1px solid #d1d5db" }}
                      />
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <input 
                        type="number" 
                        value={rowStock.M}
                        onChange={(e) => handleInputChange(p.id, "M", e.target.value)}
                        style={{ width: "60px", padding: "0.4rem", textAlign: "center", border: "1px solid #d1d5db" }}
                      />
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <input 
                        type="number" 
                        value={rowStock.L}
                        onChange={(e) => handleInputChange(p.id, "L", e.target.value)}
                        style={{ width: "60px", padding: "0.4rem", textAlign: "center", border: "1px solid #d1d5db" }}
                      />
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <input 
                        type="number" 
                        value={rowStock.XL}
                        onChange={(e) => handleInputChange(p.id, "XL", e.target.value)}
                        style={{ width: "60px", padding: "0.4rem", textAlign: "center", border: "1px solid #d1d5db" }}
                      />
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <button
                        type="button"
                        onClick={() => handleSaveRow(p.id)}
                        className="btn btn-primary btn-sm"
                        style={{ fontFamily: "var(--font-heading)", padding: "0.4rem 0.8rem", fontSize: "0.7rem" }}
                      >
                        SAVE STOCK
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
                  No products registered.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
