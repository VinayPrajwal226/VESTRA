# VESTRA — Modern Luxury Clothing & Ready-to-Wear

VESTRA is an independent ready-to-wear clothing brand and e-commerce platform built with the MERN stack architecture, featuring architectural tailoring, noble raw fibers (Mongolian Cashmere, Super 130s Wool, Giza Egyptian Cotton), and an editorial, minimalist luxury aesthetic.

---

## 🏛️ Brand & UI/UX Design

- **Aesthetic Direction**: Minimalist luxury, architectural silhouettes, generous whitespace, warm neutral surfaces (`#FAFAF9`, `#F5F5F3`), dark stone typography (`#1C1917`), and tabular numerals (`font-mono tabular-nums`).
- **Typography Pairing**: Cormorant Garamond display serif paired with Plus Jakarta Sans body typography.
- **Top Bar Contract**: Strict 1-row, 3-zone contract with a single wordmark, clean text navigation links, search, wishlist, shopping bag drawer, and concierge account access.
- **Zero-Pill Discipline**: Metadata displayed as clean, unboxed text separated by typographic dots (`·`), avoiding colored capsule badges.

---

## ⚡ Technical Stack

### Frontend:
- **Framework**: React 19 SPA powered by Vite
- **Styling**: Tailwind CSS 4 with custom serif & typography layers
- **Icons**: Lucide React
- **State Management**:
  - `AuthContext`: JWT bearer authentication, session persistence, demo role switcher
  - `CartContext`: Line items, quantities, promo code engine (`VESTRA10`, `ATELIER`), free courier threshold progress ($300)
  - `WishlistContext`: Curated pieces vault with move-to-bag affordance
- **Resilience**: Zero-broken-image fallback container with graceful styling

### Backend:
- **Runtime**: Node.js & Express.js
- **Routing**: Full RESTful API with `/api/auth`, `/api/products`, `/api/categories`, `/api/orders`, `/api/media`, `/api/admin/stats`
- **Authentication & Security**: JSON Web Tokens (JWT) with bearer header authorization, bcrypt password hashing, and role-based access control (`admin` vs `customer`)
- **Persistence**: High-reliability file-persisted JSON database engine (`server/src/services/db.ts`) with automatic atomic disk sync (`server/src/data/db.json`), pre-seeded with luxury garments, categories, and initial admin/customer accounts
- **File Management**: Multer multipart file upload engine, streaming direct file download with attachment headers, and server-side file deletion (`server/src/controllers/mediaController.ts`)

---

## 🔑 Demo Access Credentials

The application provides quick 1-click authentication buttons on the Sign In page:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Atelier Admin** | `admin@vestra.com` | `admin123` | Full CMS: product CRUD, category manager, order fulfillment, media vault, KPI metrics |
| **Client Collector** | `customer@vestra.com` | `user123` | Storefront browsing, bag, checkout, order tracking, review submission, address dossier |

---

## 📂 Page Route Architecture

### Public Storefront:
- `/` — Editorial Campaign Hero, Garment Taxonomy, Signature Pieces, Atelier Manifesto
- `/shop` — Catalog with real-time Search, Category filters, Sizing filters, Color swatches, Price range slider, Sorting (Featured, Newest, Price, Rating), and Grid switcher
- `/category/:slug` — Curated Discipline lookbook (Outerwear, Tailoring, Knitwear, Essentials, Accessories)
- `/product/:id` — PDP with sticky image gallery, size selector with live inventory counters, color swatches, technical accordions (Materials, Sizing Guide, Care, Courier terms), customer review submission, and coordinates
- `/search` — Archive search with instantaneous debounce, search suggestions, and query facets
- `/about` — The Atelier Manifesto, European workshop provenance (Biella, Porto, Umbria), and traceability commitments
- `/contact` — Client Concierge inquiry form, flagship salon addresses (New York, Milan), and FAQ accordion
- `/login` — Client authentication with 1-click Demo credentials
- `/register` — Account creation with client or admin role selection
- `/forgot-password` — Credential reset flow with simulated authorization token

### Customer & Checkout:
- `/cart` — Detailed bag view with line items, quantity steppers, promo code discount calculation, and courier threshold meter
- `/checkout` — Streamlined 2-column checkout with customer info, destination address, courier transit selection, tender options (Credit Card, Cash on Delivery, Apple Pay), and order authorization
- `/order-success/:id` — Post-order confirmation with receipt breakdown, fulfillment tracking timeline (Placed → Processing → Shipped → Delivered), and printable invoice download
- `/wishlist` — Personal vault of saved garments with instant move-to-bag action
- `/account` — User dossier: address book editor, profile details, and past order history with downloadable invoice files

### Atelier Administrator Dashboard:
- `/admin` (Overview) — Revenue metrics, order volume, catalog size, critical stock alerts, and recent acquisitions table
- `/admin/products` — Garment Registry: data table with search, stock adjuster (+/-), edit modal, delete modal, and Add Garment modal supporting Multer file upload
- `/admin/categories` — Collection taxonomy manager: add, edit, and delete categories
- `/admin/orders` — Dispatch manifests: order fulfillment filter, customer shipping inspector, tracking code assignment, and status changer (Pending, Processing, Shipped, Delivered, Cancelled)
- `/admin/media` — Media Vault: Multer file upload, preview gallery, download file action, and server deletion

---

## 🚀 Running the Project

```bash
# Start full-stack server (port 3000)
npm run dev

# Compile TypeScript
npm run lint

# Build production bundle
npm run build
```
