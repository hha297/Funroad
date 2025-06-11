# Multi-Vendor E-Commerce App

An **e-commerce platform** where creators have their own storefronts, sell digital products, and get paid through Stripe Connect. Follow this guide to get up and running with modern multi-tenant architecture and seamless payment integration.

## 🚀 Key Features

* **Multi-Tenant Architecture**: Each vendor has an isolated storefront on its subdomain.
* **Stripe Connect Integration**: Onboard vendors, handle payouts, and collect platform fees automatically.
* **Vendor Dashboards**: Separate merchant and admin dashboards for management and analytics.
* **Product Management**: Create, categorize, and filter digital products with reviews and ratings.
* **User Library**: Purchasers can access a personal library of bought products.
* **Role-Based Access Control**: Secure endpoints and UI based on user roles.
* **Image Upload Support**: Easily attach images to products and storefronts.
* **Search Functionality**: Full-text search across products and categories.
* **Custom Styling**: Built with Tailwind CSS v4 and ShadcnUI components.

## 🛠️ Tech Stack

* **Framework:** Next.js 15 (App Router)
* **CMS Backend:** Payload CMS
* **Payments:** Stripe Connect
* **Styling:** Tailwind CSS v4, ShadcnUI
* **Language:** TypeScript

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/hha297/Funroad.git
cd funroad
bun install
# or npm install
# or yarn install
# or pnpm install
```

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory containing these variables (do **not** include values):

```
# Payload CMS
DATABASE_URI
PAYLOAD_SECRET

# Global Settings
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_ROOT_DOMAIN
NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING

# Stripe
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET

# Blob Storage
BLOB_READ_WRITE_TOKEN
```

## 📜 NPM Scripts

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "generate:types": "payload generate:types",
  "db:fresh": "payload migrate:fresh",
  "db:seed": "bun run src/constants.ts"
}
```

## 🧪 Testing Payments

If you want to test payments locally, install the Stripe CLI (see Stripe docs) and run in your terminal:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## ▶️ Running the Project

```bash
bun run dev
# or npm run dev        # Next.js frontend & API

```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore your multi-vendor storefront.
