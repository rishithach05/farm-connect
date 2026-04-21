# 🌾 Farm Connect: AgriTech Marketplace

**Farm Connect** is a high-performance, full-stack Next.js application designed to empower local farmers by providing a direct-to-consumer marketplace. By eliminating middlemen, farmers earn more and consumers get fresher produce at better prices.

The application has been fully migrated from a legacy SQL architecture to a modern, scalable **MongoDB Atlas** cloud database with **Mongoose** modeling.

---

## 🚀 Modern Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** JavaScript (ES6+)
- **Database:** MongoDB Atlas (Cloud NoSQL)
- **ODM:** Mongoose 8.x
- **Authentication:** JSON Web Tokens (JWT) with secure HTTP-only cookies
- **Deployment:** Render (Automated via Blueprint)
- **Styling:** Premium Vanilla CSS (custom design system)

---

## 🏗️ Core Features

### 👨‍🌾 Farmer Power Tools
- **Sales Intelligence Dashboard:** Real-time metrics for daily/monthly earnings and total revenue.
- **Inventory Management:** Seamlessly add, update, and track crop stock levels.
- **Automated Pricing:** Define pricing by `kg`, `dozen`, `piece`, or `liter`.
- **Order Tracking:** Monitor incoming orders and sales history in real-time.

### 🛒 Consumer Experience
- **Dynamic Marketplace:** Modern grid UI with smart filtering and categorization.
- **Smart Cart System:** Persistent shopping cart with real-time total calculations.
- **Interactive Checkout:** Multi-channel checkout simulation supporting UPI/QR, Cards, and Cash on Delivery.
- **Engagement:** Wishlist items for later and leave reviews for farmers after purchase.

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas Cluster (or local MongoDB)

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_cryptographic_key
```

### 3. Install & Seed
```bash
# Install dependencies
npm install

# Seed the database (Creates 4 farmers, 19 products, and initial reviews)
node seed.js
```

### 4. Run App
```bash
npm run dev
```
Visit: `http://localhost:3000`

---

## 🚢 Deployment (Render)

This project is "Render-Ready" with a pre-configured `render.yaml` Blueprint.

1.  Connect your GitHub repo to [Render](https://render.com).
2.  Select **"Blueprint"** as the new service type.
3.  Provide your `MONGODB_URI` and `JWT_SECRET` in the dashboard.
4.  Render will automatically build and deploy your Next.js application.

---

## 📂 Project Architecture
- `/app/api`: Clean RESTful routes using Mongoose logic.
- `/lib/models`: Schema definitions for `User`, `Product`, `Order`, `Review`, and `Wishlist`.
- `/lib/mongodb.js`: Shared database connection with global caching for warm reloads.
- `/components`: Modular UI components (Navbar, Footer, etc.).
- `/public/images`: Local fallback assets and UI icons.

---

## 🔒 Security
- **JWT Authentication:** Handled via secure, HTTP-only cookie injection.
- **RBAC (Role Based Access Control):** Specific routes and APIs protected for `FARMER` or `CUSTOMER` roles.
- **Data Integrity:** Mongoose schemas enforce strict validation and type-safety at the database layer.
