# Wektor 3D – Next-Gen Manufacturing Platform

![Tech Stack](https://img.shields.io/badge/Astro_5-FF5D01?style=for-the-badge&logo=astro&logoColor=white)
![Tech Stack](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tech Stack](https://img.shields.io/badge/Tailwind_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Tech Stack](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

> **Live Demo:** [wektor3d.pl](https://www.wektor3d.pl/)

## ⚡ Project Overview
**Wektor 3D** is a high-performance landing page and lead generation platform for a 3D printing and reverse engineering business. 

Unlike typical static sites, this project pushes the boundaries of modern web development by adopting **Bleeding Edge** technologies (React 19, Tailwind v4, Astro 5) to deliver a 100/100 Lighthouse performance score while maintaining rich 3D interactivity.

---

## 🏗️ Technical Case Study

### 1. The Challenge
The client needed a platform that:
- Showcases technical precision (hence the need for 3D visualization).
- Loads instantly on mobile devices (where 70% of traffic comes from).
- Converts leads effectively with complex pricing logic.
- Ranks high in Google (SEO) without paid ads.

### 2. The Solution: Astro Islands Architecture
Instead of sending a heavy React bundle for the entire page, I utilized **Astro Islands**.
- **Static HTML** by default (Hero, Offer, Text content).
- **React 19** hydrates *only* where necessary:
    - `Scene3D` (Interactive 3D model viewer).
    - `Calculator` (Real-time pricing logic).
    - `ContactForm` (Client-side validation).

**Result:** Time-to-Interactive (TTI) is near-instant, despite loading heavy 3D assets.

---

## 🛠️ Key Engineering Features

### 🛡️ Type-Safe Validation (Zod)
Instead of relying on basic HTML attributes, the contact form uses **Zod** schema validation.
- **Why?** To handle complex conditional logic (e.g., "Link to model" is required *only* if "Print Service" is selected).
- **Code:** `src/lib/contactSchema.ts` ensures data integrity before it ever leaves the client.

### 🎨 Micro-Interactions & 3D (Three.js)
- **Problem:** Static images of 3D prints are boring.
- **Solution:** Implemented a lightweight **React Three Fiber** viewer (`src/components/react/Scene3D.jsx`) that lets users rotate and inspect a sample part in real-time.
- **Optimization:** The 3D scene loads lazily (`client:visible`), ensuring it doesn't block the initial paint.

### 🔍 Technical SEO & Canonicalization
To solve duplicate content issues common with modern deployments (Vercel vs. Custom Domain):
- Implemented **Dynamic Canonical Tags** in `Layout.astro`.
- Configured **Google Tag Manager** with **Consent Mode v2** defaults (`denied`), ensuring GDPR compliance while maintaining verifiability for Google Bots.

### ⚡ Tailwind CSS v4 (Alpha/Beta Adoption)
- Adopted the new **Rust-based oxide engine** for lightning-fast compilation.
- Used modern CSS features (OKLCH colors, container queries) native to v4.

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── react/         # Interactive Islands (Scene3D, Calculator)
│   ├── CookieBanner   # GDPR Consent Manager
│   └── ...            # Static Astro Components
├── layouts/
│   └── Layout.astro   # SEO Head, GTM, Canonical Logic
├── lib/
│   └── contactSchema  # Zod Validation Schemas
└── pages/             # File-based Routing
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server (Turbo)
npm run dev

# Build for production
npm run build
```

---

*Engineered by [Wektor Kodu](https://wektorkodu.pl).*
