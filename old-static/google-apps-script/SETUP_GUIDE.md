# MANUSDRIP — Owner Management System & Google Cloud Setup Guide

This guide walks you through connecting your **ManusDrip** management panel to **Google Sheets**, **Google Drive**, and **Google Apps Script** without touching any website source code.

---

## 🏗️ Architecture Overview

```
                         EXISTING
                    MANUSDRIP WEBSITE
                            ↑
                            |
                       API / JSON
                            |
                     GOOGLE APPS SCRIPT
                       /          \
                      /            \
                     ↓              ↓
             GOOGLE SHEETS      GOOGLE DRIVE
             Product data        Product images
             Inventory           Folders per product
             Categories
             Settings

Admin Panel Flow:

             STORE OWNER
                  ↓
             ADMIN LOGIN (/admin/login.html)
                  ↓
             MANUSDRIP MANAGEMENT PANEL (/admin/)
                  ↓
             GOOGLE APPS SCRIPT (doPost / doGet)
                  ↓
             GOOGLE SHEETS & DRIVE
```

---

## STEP 1 — Create the Google Spreadsheet

1. Open [Google Sheets](https://sheets.new).
2. Name your spreadsheet: **`MANUSDRIP STORE DATABASE`**.
3. You can either let the automated button in the Admin Panel create the 4 tabs, or create them manually:

### Tab 1: `PRODUCTS`
Headers in Row 1:
```
product_id | product_name | description | category | price | status | featured | new_arrival | bestseller | created_at | updated_at
```

### Tab 2: `INVENTORY`
Headers in Row 1:
```
product_id | size | stock
```

### Tab 3: `CATEGORIES`
Headers in Row 1:
```
category_id | category_name | active
```

### Tab 4: `SETTINGS`
Headers in Row 1:
```
setting | value
```

---

## STEP 2 — Create the Google Drive Image Folder

1. Open [Google Drive](https://drive.google.com).
2. Create a folder named: **`MANUSDRIP`**.
3. Inside `MANUSDRIP`, create a subfolder named: **`PRODUCT IMAGES`**.
4. Right-click **`PRODUCT IMAGES`** > **Share** > under *General access*, change to **Anyone with the link can view**.  
   *(This allows product photos uploaded by the owner to be displayed directly on the website).*

---

## STEP 3 — Deploy Google Apps Script (Code.gs)

1. In your Google Sheet, click **Extensions** > **Apps Script**.
2. Name the Apps Script project: **`MANUSDRIP API`**.
3. Open `Code.gs`, erase any default code, and paste the complete content of [`google-apps-script/Code.gs`](file:///Users/afnansheikh/Downloads/manusdrip/google-apps-script/Code.gs).
4. Click the **Save** icon (disk icon).

---

## STEP 4 — Deploy as a Web App

1. In the top-right corner of Apps Script, click **Deploy** > **New deployment**.
2. Click the gear icon (⚙️) next to *Select type* and select **Web app**.
3. Enter details:
   - **Description**: `ManusDrip Store Backend API`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` *(Required so your customer website can read product data)*.
4. Click **Deploy**.
5. Click **Authorize access** > choose your Google account > click **Advanced** > **Go to MANUSDRIP API (unsafe)** > **Allow**.
6. Copy the generated **Web app URL** (`https://script.google.com/macros/s/.../exec`).

---

## STEP 5 — Configure Your Management Panel

1. Open your Admin Panel at [`admin/settings.html`](file:///Users/afnansheikh/Downloads/manusdrip/admin/settings.html).
2. Enter:
   - **Google Apps Script Web App URL**: Paste your copied Web App URL.
   - **Google Spreadsheet ID**: *(Optional if container-bound)* Found in your Sheet URL: `docs.google.com/spreadsheets/d/`**`[SPREADSHEET_ID]`**`/edit`.
   - **Google Drive Folder ID**: Found in your Drive URL: `drive.google.com/drive/folders/`**`[FOLDER_ID]`**.
3. Click **SAVE CONFIGURATION**.
4. Click **TEST CONNECTION** — confirm the green success toast.
5. Click **INITIALIZE GOOGLE SHEETS & DRIVE** — this automatically creates and verifies all 4 sheets, headers, categories (`T-Shirts`, `Shirts`, `Hoodies`, `Pants`), settings, and Drive folders.

---

## STEP 6 — Admin Login & Operations

1. Go to [`admin/login.html`](file:///Users/afnansheikh/Downloads/manusdrip/admin/login.html).
2. Enter your store password (default: `drip` or your custom password).
3. The server validates the password through Google Apps Script and grants access to the dashboard.
4. You can now:
   - **Add Products**: Upload images from computer, select sizes, set stock quantities, prices, descriptions, and flags.
   - **Edit & Duplicate**: Update any detail anytime.
   - **Manage Inventory**: Live inline size-wise stock edits (`M = 15 → 14`).
   - **Manage Categories**: Add or disable product categories.
   - **Settings**: Change WhatsApp number, store pickup address, Instagram link, or toggle launch mode between **`COMING_SOON`** and **`LIVE`**.

---

## 🔒 Security Notes
- Admin passwords are never hardcoded in client-side code.
- Write actions (`ADD_PRODUCT`, `UPDATE_STOCK`, `UPLOAD_IMAGE`, `UPDATE_SETTINGS`, etc.) require authenticated admin tokens verified by Google Apps Script.
- Public actions (`GET_PRODUCTS`, `GET_PRODUCT`, `GET_SETTINGS`) are accessible for the customer storefront to consume JSON data.
