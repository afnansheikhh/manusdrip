"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // If path is admin path, do not render public footer
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" aria-label="ManusDrip Home">
              <img src="/images/logo/logo-white.png" alt="ManusDrip Logo" width="160" height="40" />
            </Link>
            <p>
              Contemporary men's streetwear made for people who define their own style. Heavyweight essentials and modern silhouettes in Hospet.
            </p>
          </div>

          <div>
            <h4 className="footer-heading">NAVIGATION</h4>
            <ul className="footer-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/shop">Shop Collection</Link></li>
              <li><Link href="/about">About ManusDrip</Link></li>
              <li><Link href="/contact">Hospet Store</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">HELP</h4>
            <ul className="footer-links">
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/size-guide">Size Guide</Link></li>
              <li><Link href="/contact">Store Location</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">STORE</h4>
            <ul className="footer-links">
              <li><Link href="/about">About Brand</Link></li>
              <li><Link href="/contact">Hospet Store Location</Link></li>
              <li><Link href="/contact">WhatsApp Inquiry</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">CONNECT</h4>
            <ul className="footer-links">
              <li>
                <a 
                  href="https://www.instagram.com/crushb0yy_?igsh=MXN3aXp3eTJtbXB1dg==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Instagram (@crushb0yy_)
                </a>
              </li>
              <li><Link href="/contact">WhatsApp Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 ManusDrip • Men's Clothing & Streetwear • Hospet. All rights reserved.</p>
          <p>Built for your drip.</p>
        </div>
      </div>
    </footer>
  );
}
