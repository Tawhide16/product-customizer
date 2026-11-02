# Origin — Universal Product Customization Studio

> A high-performance, photorealistic **Universal Product Customizer** designed for modern e-commerce storefronts, including **Shopify**, **WooCommerce**, **Next.js**, and **Headless REST APIs**.

---

## 🌟 Overview

**Origin Product Customization Studio** provides customers and merchants with an interactive design studio for apparel, accessories, and home goods. Built with **Next.js 16 (Turbopack)** and **React 19**, it delivers instant sub-second rendering, realistic physical fabric lighting, safe print-zone boundaries, dynamic multi-side configuration, and volume tier pricing.

---

## 🚀 Key Features

### 1. Modern 3-Panel Studio Architecture
* **Left Sidebar (Design Tools & Settings Drawer):**
  - **Typography:** Multi-line text support, curated Google Fonts, curvature arching, outline strokes, font size, and letter spacing sliders.
  - **Clipart & Vectors:** Categorized vector graphics (Streetwear, Y2K, Minimal, Badges) with one-click color tinting.
  - **Customer Artwork Upload:** Drag-and-drop dropzone with instant client-side preview, 300-DPI print readiness check, and image filters (Grayscale, Sepia, Invert).
  - **QR Code Generator:** Real-time SVG QR code generation for URLs, socials, and contact cards.
  - **Player Roster (Athletics):** Team name & jersey number customizer.
  - **Canvas Layers & Alignment:** Reorder z-index layers, toggle element visibility, duplicate, lock, and center-align objects.

* **Center Workspace (Interactive Design Canvas):**
  - **Photorealistic Studio Mockups:** High-resolution transparent photographic studio models for **Unisex Heavy Cotton T-Shirt**, **Streetwear Fleece Hoodie**, **iPhone Tough Case**, **Canvas Market Tote Bag**, and **Plush Throw Pillow**.
  - **Physical Material Lighting & Ink Physics:** 
    - *Light Garments:* Direct-to-Garment (DTG) ink absorption (`mix-blend-mode: multiply`), allowing natural fabric creases and lighting to show through printed designs.
    - *Dark Garments:* Plastisol screen-print emulation with micro-press edge depth.
    - *Textile Weave Overlays:* Ultra-fine cotton jersey, brushed fleece, canvas grid, and plush linen textures embedded directly into designs.
  - **Print Boundary Enforcement:** Strictly auto-crops any element extending beyond the printable safe zone.
  - **Multi-Side View ("On a Hanger" Dock):** Smooth switching between Front and Back garment print zones with active layer counters.
  - **Interactive Turntable Stage:** Smooth zoom controls (60% to 160%), safe-area toggle, and 360° showcase podium.

* **Right Sidebar (Catalog, Content, Assets & Pinned Garment Specs):**
  - **4 Segmented Library Tabs:**
    1. *Catalog:* Style search, category filters (`All`, `Apparel`, `Accessories`, `Bags`, `Home`), 2-column cards, and wishlist toggling.
    2. *Content:* Streetwear slogan presets and quick text insertion.
    3. *Images:* Direct graphic uploads and stock art.
    4. *Assets:* Vector clipart library and layout templates.
  - **Pinned Garment Controls:** Active color swatches, luxury size pills, turnaround/care accordions, real-time volume tier pricing calculation, and direct "Add to Bag" cart flow.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 16.4.3](https://nextjs.org/) (App Router, Turbopack, Standalone Output)
* **Frontend Library:** [React 19](https://react.dev/)
* **Language:** [TypeScript 5](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Visual FX & Utilities:** Canvas Confetti, QRCode SVG generator, Sharp (image processing)

---

## 📂 Project Structure

```text
product-customizer/
├── public/                      # Static assets & photographic studio mockups
│   ├── logo.png                 # Brand logo & social previews
│   └── products/                # Transparent photographic product mockups
│       ├── tshirt.png           # Unisex Heavy Cotton T-Shirt
│       ├── hoodie.png           # Streetwear Fleece Hoodie
│       ├── iphone-case.png      # iPhone 16 Pro Case
│       ├── tote-bag.png         # Canvas Tote Bag
│       └── throw-pillow.png     # Square Throw Pillow
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Root layout & OpenGraph metadata
│   │   ├── page.tsx             # Main view router (Studio, Storefront, Admin)
│   │   └── globals.css          # Tailwind CSS v4 directives
│   ├── components/
│   │   ├── Mockups/             # Photorealistic Mockup & Surface Lighting overlays
│   │   │   ├── ProductMockupSvg.tsx
│   │   │   └── ProductSurfaceOverlay.tsx
│   │   ├── StorefrontCustomizer/# Core 3-panel Customizer Studio
│   │   │   ├── CanvasArea.tsx   # Interactive canvas stage, cropping & zoom
│   │   │   ├── Studio.tsx       # Main state machine, tool & catalog drawers
│   │   │   ├── TextControls.tsx # Typography & curvature controls
│   │   │   ├── ClipartControls.tsx
│   │   │   ├── UploadControls.tsx
│   │   │   ├── QRCodeControls.tsx
│   │   │   ├── RosterControls.tsx
│   │   │   ├── LayersControls.tsx
│   │   │   ├── RealisticPreviewModal.tsx
│   │   │   └── CartDrawer.tsx   # Slide-out bag & order summary
│   │   ├── MerchantDashboard/   # Admin views, product catalog & integration guides
│   │   └── ShopifyPolarisHeader.tsx
│   ├── data/                    # Seed catalog products & tiered pricing settings
│   └── types/                   # TypeScript interfaces (Product, DesignElement, PrintArea)
├── Dockerfile                   # Multi-stage production container build
├── docker-compose.yml           # Local & production container orchestration
├── .dockerignore                # Container build exclusions
├── next.config.ts               # Next.js standalone output configuration
└── package.json
```

---

## 💻 Getting Started (Local Development)

### Prerequisites
* **Node.js:** `v20.x` or `v22.x` (LTS recommended)
* **npm:** `v10.x` or higher (or pnpm / yarn)

### 1. Clone the repository
```bash
git clone https://github.com/Tawhide16/product-customizer.git
cd product-customizer
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the interactive studio.

### 4. Build for production locally
```bash
npm run build
npm run start
```

---

## 🐳 Docker Setup & Containerization

The project includes an optimized **multi-stage `Dockerfile`** using Alpine Linux and Next.js `standalone` mode, producing a lean, secure, and unprivileged container image (< 180MB).

### Method A: Using Docker Compose (Recommended)

1. **Build and start the container:**
   ```bash
   docker compose up --build -d
   ```

2. **Access the application:**
   Navigate to [http://localhost:3000](http://localhost:3000).

3. **Check container logs:**
   ```bash
   docker compose logs -f
   ```

4. **Stop the container:**
   ```bash
   docker compose down
   ```

---

### Method B: Using Docker CLI Directly

1. **Build the Docker image:**
   ```bash
   docker build -t product-customizer:latest .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name product-customizer-app \
     -p 3000:3000 \
     --restart unless-stopped \
     product-customizer:latest
   ```

3. **Stop & remove the container:**
   ```bash
   docker stop product-customizer-app
   docker rm product-customizer-app
   ```

---

## 🌐 Platform Integrations

Origin is built to operate seamlessly across multiple e-commerce environments:

| Platform | Integration Method | Capabilities |
| :--- | :--- | :--- |
| **Standalone Web / Next.js** | Native App Router | Full server-side rendering, sub-second Turbopack compilation. |
| **Shopify** | App Embed / Polaris | Embedded iframe or Polaris App Bridge with automated cart line-item properties. |
| **WooCommerce** | REST API & Webhooks | WordPress plugin iframe injection passing order vector JSON payloads. |
| **Headless E-Commerce** | REST / GraphQL APIs | Decoupled client generating standardized 300-DPI composite specs and SVG export. |

---

## 🤝 Collaboration & Contribution Protocol

To maintain code integrity and ensure zero merge conflicts across teammates:

1. **Always Pull Before Starting Work:**
   ```bash
   git pull origin main
   ```
2. **Work Locally First:**
   Test all features and UI adjustments on `localhost:3000` first.
3. **Run Typecheck & Build:**
   ```bash
   npx tsc --noEmit
   npm run build
   ```
4. **Conventional Commits:**
   Follow standard conventional commit messages (e.g., `feat(...)`, `fix(...)`, `docs(...)`).
5. **Push Protocol:**
   Always sync before pushing:
   ```bash
   git pull origin main
   git push origin main
   ```

---

## 📄 License

This project is proprietary and confidential. All rights reserved.
