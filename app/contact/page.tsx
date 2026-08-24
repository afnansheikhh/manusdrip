"use client";

import { useStore } from "@/lib/storeContext";

export default function Contact() {
  const { settings } = useStore();

  const whatsappNumber = settings?.whatsapp_number || "916366691845";
  const address = settings?.store_address || "Hospet, Karnataka, India";
  const mapsUrl = "https://maps.google.com/?q=Hospet+Karnataka+India";

  return (
    <main style={{ marginTop: "120px", marginBottom: "5rem" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <span className="editorial-caption" style={{ color: "var(--color-brand-red)" }}>VISIT US IN HOSPET</span>
        <h1 className="display-title" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", marginTop: "0.25rem", marginBottom: "2rem" }}>
          GET IN TOUCH
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem", marginTop: "1.5rem" }}>
          
          {/* Details */}
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: "var(--color-primary)", marginBottom: "1rem" }}>
              STORE HOURS & LOCATION
            </h2>
            <div style={{ color: "var(--color-gray-600)", lineHeight: "1.8", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p>
                <strong>Hospet Flagship Store:</strong><br />
                {address}
              </p>
              <p>
                <strong>Hours:</strong><br />
                Monday – Sunday: 11:00 AM – 9:30 PM
              </p>
              <a 
                href={mapsUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ textDecoration: "underline", fontWeight: 700, color: "var(--color-primary)" }}
              >
                OPEN IN GOOGLE MAPS
              </a>
            </div>
          </div>

          {/* Socials & Help */}
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: "var(--color-primary)", marginBottom: "1rem" }}>
              WHATSAPP & CUSTOMER HELP
            </h2>
            <div style={{ color: "var(--color-gray-600)", lineHeight: "1.8", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <p>
                For direct size availability, orders, exchanges, and general inquiries, reach our store team directly:
              </p>
              <a 
                href={`https://wa.me/${whatsappNumber}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-whatsapp" 
                style={{ display: "inline-flex", justifyContent: "center", textDecoration: "none" }}
              >
                CHAT ON WHATSAPP
              </a>
              <p>
                <strong>Instagram Updates:</strong><br />
                Follow us <a href="https://www.instagram.com/crushb0yy_?igsh=MXN3aXp3eTJtbXB1dg==" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "var(--color-brand-red)", fontWeight: 800 }}>@crushb0yy_</a> for immediate drop drops.
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
