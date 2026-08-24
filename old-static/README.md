# MANUSDRIP — Official Fashion & Streetwear Website & Management Panel

> **WEAR YOUR DRIP.**  
> Contemporary streetwear made for people who define their own style.

This repository contains the complete customer-facing website and private owner management panel for **ManusDrip**, built strictly using pure **HTML5**, **Vanilla CSS3**, and **Vanilla JavaScript (ES6+)**, fully connected to **Google Sheets**, **Google Drive**, **Google Apps Script**, and **Direct WhatsApp Ordering**.

---

## 💬 WhatsApp Direct Ordering Workflow

ManusDrip uses a direct **WhatsApp Click-to-Chat Ordering** workflow. Instead of requiring an upfront payment gateway, customers submit itemized order inquiries directly to the store owner on WhatsApp, who verifies size stock, confirms the order, and provides payment/delivery details.

```
CUSTOMER
  ↓
1. Browses product / Adds to cart
2. Selects Size & Quantity (Stock checked in real-time)
3. Clicks "BUY ON WHATSAPP" or "ORDER VIA WHATSAPP"
  ↓
WhatsApp opens with pre-filled, URL-encoded inquiry:
- Reference ID (e.g. MD-20260810-8429)
- Itemized Product Name, ID, Size, Color, Quantity, Unit Price
- Estimated Total & Shipping
- Public Product Page link & Public Image URL
  ↓
STORE OWNER
  ↓
1. Receives order inquiry on WhatsApp
2. Confirms availability & size stock
3. Provides payment & shipping dispatch details
```

### Central WhatsApp Number Configuration
The store WhatsApp number is managed centrally in [`js/config.js`](file:///Users/afnansheikh/Downloads/manusdrip/js/config.js) and can be updated at any time directly through the **Admin Panel Settings** without editing source code:

- **Config File**: `StoreConfig.getWhatsAppNumber()` / `StoreConfig.setWhatsAppNumber("91XXXXXXXXXX")`
- **Admin Settings**: [`admin/settings.html`](file:///Users/afnansheikh/Downloads/manusdrip/admin/settings.html) > **WHATSAPP ORDERING CONFIGURATION**

---

## 🏛️ System Architecture

```
                    MANUSDRIP
                       │
          ┌────────────┴────────────┐
          │                         │
          ↓                         ↓
   CUSTOMER WEBSITE            OWNER PANEL
   HTML / CSS / JS             HTML / CSS / JS
   - js/config.js              - admin/settings.html
   - js/api.js                 - admin/js/api.js
   - js/product-page.js        - admin/js/inventoryService.js
          │                         │
          ├─────────────────────────┤
          │                         ↓
          │                  GOOGLE APPS SCRIPT
          │                  (doGet / doPost API)
          │                         │
          │              ┌──────────┴──────────┐
          │              ↓                     ↓
          │       GOOGLE SHEETS          GOOGLE DRIVE
          │       Product Data            Images
          │       - PRODUCTS             - MANUSDRIP/
          │       - INVENTORY                PRODUCT IMAGES/
          │       - CATEGORIES                   {product_id}/
          │              │                     │
          ↓              └─────────────────────┘
   WHATSAPP ORDERING (wa.me)
   Direct Owner Inquiry & Confirmation
```

---

## 📁 Repository Structure

```
manusdrip/
│
├── 🌐 CUSTOMER-FACING STOREFRONT
│   ├── index.html            # Homepage (Hero, Drops, Bestsellers, Lookbook, Newsletter)
│   ├── shop.html             # Dynamic Catalog (Category, Gender, Size, Price, Sorting)
│   ├── product.html          # Dynamic PDP (Gallery switcher, Stock indicators, BUY ON WHATSAPP)
│   ├── cart.html             # Shopping Cart with ORDER VIA WHATSAPP checkout
│   ├── wishlist.html         # Saved items manager with 1-click Move to Cart
│   ├── about.html            # Editorial brand storytelling and pillars
│   ├── contact.html          # Responsive contact form with validation feedback
│   ├── size-guide.html       # Sizing reference for Oversized Tees, Hoodies, Cargo Pants
│   ├── css/style.css         # Storefront design system (#111111, #C1121F, #25D366 WhatsApp)
│   ├── js/config.js          # Central Store Config (WhatsApp number, Reference IDs, URLs)
│   ├── js/api.js             # Public Google Apps Script API client with 5-min caching
│   ├── js/products.js        # Unified product query engine & data access layer
│   ├── js/main.js            # Cart & Wishlist state manager, WhatsApp cart ordering, Floating widget
│   └── js/product-page.js    # Dynamic PDP controller, real-time stock checks, WhatsApp order builder
│
├── 🔒 PRIVATE OWNER MANAGEMENT PANEL (/admin/)
│   ├── admin/index.html      # Owner login gateway with demo auth & route guards
│   ├── admin/dashboard.html  # KPI metric overview, low-stock alerts, recent products
│   ├── admin/products.html   # Product management (Search, Filter, Edit, Duplicate, Delete)
│   ├── admin/add-product.html# Product creation form (Image upload dropzone, Size matrix)
│   ├── admin/edit-product.html# Pre-filled product edit view
│   ├── admin/inventory.html  # Dedicated size-wise quick inline stock adjuster
│   ├── admin/categories.html # Dynamic category manager (Add, rename, toggle status)
│   ├── admin/settings.html   # WhatsApp number config, Cloud Web App URL, Connection test & DB init
│   │
│   ├── admin/css/admin.css   # High-contrast, responsive admin design system
│   │
│   └── admin/js/
│       ├── api.js            # Admin Cloud API client with admin_key authorization
│       ├── authService.js    # Demo authentication and route security guards
│       ├── productService.js # Product CRUD abstraction layer (Cloud first, local fallback)
│       ├── inventoryService.js # Size-wise stock updater & inventory KPI metrics
│       ├── categoryService.js # Dynamic category manager
│       ├── imageService.js   # Local file reader & direct Google Drive image uploader
│       └── admin.js          # Global sidebar, mobile drawer, modals, and toasts
│
├── ☁️ GOOGLE APPS SCRIPT BACKEND (/google-apps-script/)
│   ├── Code.gs               # Complete Google Apps Script API server implementation
│   ├── appsscript.json       # Apps Script manifest configuration
│   └── SETUP_GUIDE.md        # Step-by-step setup guide with screenshots and verification tests
│
├── images/
│   ├── logo/                 # Official ManusDrip logo assets (Transparent, white & original)
│   ├── products/             # Garment photography assets
│   └── banners/              # Campaign banners
│
└── README.md                 # Project documentation
```

---

## ⚡ Quick Start: Running Locally

```bash
cd manusdrip
python3 -m http.server 8000
```

- **Customer Website**: `http://localhost:8000/index.html`
- **Product Page with WhatsApp CTA**: `http://localhost:8000/product.html?id=MD001`
- **Cart with WhatsApp Checkout**: `http://localhost:8000/cart.html`
- **Admin Panel**: `http://localhost:8000/admin/index.html` (Demo credentials: `admin@manusdrip.com` / `drip`)

---
© 2026 ManusDrip. All rights reserved. Built for your drip.
