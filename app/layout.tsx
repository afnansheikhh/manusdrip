import type { Metadata } from "next";
import { StoreProvider } from "@/lib/storeContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Drawers from "@/components/Drawers";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: "ManusDrip | Men's Clothing & Streetwear | Hospet",
  description: "Contemporary men's streetwear made for people who define their own style. Heavyweight essentials and modern silhouettes in Hospet, Karnataka, India.",
  icons: {
    icon: "/images/logo/logo.png"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Syne:wght@400..800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <StoreProvider>
          <Header />
          {children}
          <Footer />
          <Drawers />
          <WhatsAppWidget />
        </StoreProvider>
      </body>
    </html>
  );
}
