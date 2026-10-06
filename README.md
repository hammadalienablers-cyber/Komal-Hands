# Komal Accessories — Boutique E-Commerce Store & Supabase Backend

A production boutique e-commerce web application with a live Store Manager (Admin Portal) for teen hair accessories, cute jewelry, trendy adult pieces, baby accessories, and luxury gift hampers. Built with React 19, TypeScript, Tailwind CSS, and a real Supabase backend (PostgreSQL, Row Level Security, Supabase Auth, Storage, and Realtime).

---

## 🔒 Security & Environment Architecture

1. **Strict Production Environment**:
   - In production builds (`npm run build`), if `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` is missing or invalid, the application **refuses to run in silent demo mode** and renders a full-screen **"Store Backend is Not Configured"** screen. This prevents lost customer orders and false order confirmations.
   - In local development (`npm run dev`), demo mode is allowed with mock data, displaying a persistent **"DEMO MODE — data is not saved online"** badge at the top of the storefront and a red warning banner in the Admin Dashboard.

2. **Strict Admin Authentication (No Passcode Bypass)**:
   - There are **NO hardcoded passwords** (no `admin123`, `komal`, `admin`, or `1234`) and **no 1-Click login buttons** anywhere in the code.
   - Admin login functions **strictly through Supabase Auth** (`signInWithPassword`) and enforces that the authenticated user's `user_id` exists in the `public.admins` authorization table.

---

## 🚀 Supabase Backend Setup (5 Minutes)

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Note your **Project URL** and **anon public key** from `Project Settings -> API`.

### 2. Run Database Schema & RPC Functions
1. In your Supabase Dashboard, open **SQL Editor**.
2. Click **New query**, paste the entire content of `supabase/schema.sql` from this repository, and click **Run**.
3. This creates:
   - `categories`, `products`, `coupons`, `store_settings`, `orders`, and `admins` tables.
   - **Row Level Security (RLS)** on all tables (public can view products, categories, settings; anon cannot select orders table).
   - **Security Definer RPCs**:
     - `place_order`: Recomputes subtotal, shipping, and discount on the server from DB rows, checks stock, decrements inventory, and creates order with initial timeline.
     - `track_order`: Requires matching `order_id` and customer `phone` to retrieve parcel tracking.
     - `validate_coupon`: Validates coupon code and minimum cart value server-side.
   - Seed data with all initial boutique categories, products, coupons, and store settings.

### 3. Setup Storage for Product Images
1. In your Supabase Dashboard, go to **Storage**.
2. Create a new bucket named **`product-images`**.
3. Toggle **"Public bucket"** to **ON** (so customer browsers can render image URLs).
4. Under Storage Policies, public `SELECT` is enabled and authenticated admins can `INSERT`/`UPDATE`.

### 4. Create Your Admin Account
1. In Supabase Dashboard -> **Authentication** -> **Users**, click **"Add user"** -> **"Create user"**.
2. Enter your admin email and password.
3. Copy the generated **User UID** (UUID).
4. Go to **SQL Editor** and run the snippet found in `supabase/schema.sql`:
```sql
insert into public.admins (user_id) values ('PASTE_AUTH_USER_ID_HERE');
```
*(Replace `PASTE_AUTH_USER_ID_HERE` with your actual User UID).*

### 5. Disable Public Email Signups (Critical Security Step)
To ensure only authorized administrators can ever sign in:
1. In Supabase Dashboard, navigate to **Authentication** -> **Providers** -> **Email**.
2. Keep **Enable Email provider** turned **ON**.
3. **UNCHECK** **"Enable Email Signup"** (Allow new users to sign up).
4. Click **Save**.
*Now only users created directly by the store owner inside the Supabase Auth dashboard can exist.*

---

## 💻 Local Development

### 1. Configure Environment Variables
Copy `.env.example` to `.env` (never commit `.env`):
```bash
cp .env.example .env
```
Edit `.env`:
```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
```

### 2. Install & Run
```bash
npm install
npm run dev
```
Open `http://localhost:3000/komal-accessories/` in your browser.

---

## 🌐 Deploy to GitHub Pages

This repository is configured for zero-config automatic deployment to GitHub Pages via GitHub Actions:

### 1. Set Repository Secrets
In your GitHub Repository, go to:
**Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**:
1. `VITE_SUPABASE_URL` = `https://your-project-id.supabase.co`
2. `VITE_SUPABASE_ANON_KEY` = your Supabase public anon key

### 2. Enable GitHub Pages via GitHub Actions
In your GitHub Repository:
1. Go to **Settings** -> **Pages**.
2. Under **Build and deployment** -> **Source**, select **GitHub Actions**.

### 3. Push to GitHub
```bash
git add .
git commit -m "feat: deploy to GitHub Pages with Supabase backend"
git branch -M main
git push -u origin main
```
The workflow at `.github/workflows/deploy.yml` will automatically build the site with `base: '/komal-accessories/'` and deploy it live to:
`https://<YOUR_USERNAME>.github.io/komal-accessories/`

---

## 🛠️ Store Manager (Admin Portal)
- Access the Admin Portal by clicking the **"Admin / Manager"** button in the header or the **"Store Manager Portal"** link in the footer.
- Sign in with your Supabase Admin email and password.
- Features:
  - Add & edit products with automatic image resizing/compression (max ~1200px) and upload to Supabase Storage `product-images` bucket.
  - Live rates management & instant price updates.
  - Categories management with live store navigation synchronization.
  - Real-time order monitoring with Supabase Realtime subscriptions.
  - Order status stepping (*Placed* -> *Packed* -> *Dispatched* -> *Out for Delivery* -> *Delivered*) updating DB and audit timeline.
  - Customer WhatsApp direct messaging with order details.
  - Printable packing slip & invoice generation.
  - Promo coupons creation and management.
  - Store settings & shipping rates customization.

---

## 💻 Tech Stack
- **Database & Auth & Storage**: Supabase (PostgreSQL, Row Level Security, RPC functions, Realtime)
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Motion
