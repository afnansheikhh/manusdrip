"use client";

import { useStore } from "@/lib/storeContext";
import { usePathname } from "next/navigation";

export default function WhatsAppWidget() {
  const pathname = usePathname();
  const { settings } = useStore();

  if (pathname?.startsWith("/admin")) return null;

  const phone = settings?.whatsapp_number || "916366691845";
  const msg = "Hi ManusDrip! 👋 I'd like to know more about the upcoming collection in Hospet.";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

  return (
    <button
      type="button"
      onClick={() => window.open(url, "_blank")}
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        backgroundColor: "#25D366",
        color: "#ffffff",
        border: "none",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        zIndex: 9999,
        transition: "transform 0.2s"
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      aria-label="Chat on WhatsApp"
    >
      <svg style={{ width: "32px", height: "32px" }} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.072-1.042-.061-.83-.27-1.745-.785-2.536-1.576-.791-.79-1.306-1.705-1.576-2.535-.133-.408-.106-.73-.061-1.042.05-.333.419-1.026.824-1.17.135-.048.281-.03.385.048.104.078.232.396.347.675.115.279.231.574.269.65.044.089.029.193-.038.281-.067.089-.142.179-.214.264-.072.086-.149.176-.231.258-.094.094-.094.195-.015.334.257.447.632.915 1.077 1.36.445.445.913.82 1.36 1.077.139.079.24.079.334-.015.082-.082.172-.159.258-.231.085-.072.175-.147.264-.214.088-.067.192-.082.281-.038.076.038.371.154.65.269.279.115.597.243.675.347.078.104.096.25.048.385zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.436 5.176L2 22l4.981-1.396A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.587 0-3.085-.444-4.364-1.218l-.312-.188-2.956.825.836-2.906-.204-.326A8.17 8.17 0 013.8 12c0-4.522 3.678-8.2 8.2-8.2 4.522 0 8.2 3.678 8.2 8.2 0 4.522-3.678 8.2-8.2 8.2z" />
      </svg>
    </button>
  );
}
