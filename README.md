# 🌾 Farm Connect: AgriTech Marketplace

Farm Connect is a comprehensive, full-stack Next.js application designed to bridge the gap between local farmers and consumers. It bypasses traditional supply chain middlemen, allowing farmers to list their fresh produce directly and buyers to purchase them securely.

## 🚀 Core Technologies
- **Frontend:** Next.js 14, React 18
- **Backend APIs:** Next.js Route Handlers (`app/api/*`)
- **Database:** SQLite (Local Dev Environment)
- **ORM:** Prisma Client
- **Authentication:** JSON Web Tokens (JWT) via HTTP-only Cookies
- **Styling:** Custom Vanilla CSS for maximum performance and modern UI aesthetics

---

## 🏗️ Features Documented

### 👨‍🌾 For Farmers
- **Authentication & RBAC:** Secure login flow specifically routing Farmers to their workspace.
- **Dynamic Dashboard:** Real-time calculation of daily, monthly, and all-time revenue natively parsed via Server Components.
- **Inventory Management:** Add new crops, set pricing, define units (`kg`, `liters`), and watch inventory automatically deduct when orders are placed.
- **Sales Analytics:** Visual CSS-driven metrics to track which crops are selling fastest.

### 🛒 For Consumers (Buyers)
- **Marketplace Browsing:** A rich, responsive UI with advanced filtering (Price Caps, Categories, Simulated Sorts).
- **Shopping Cart & Checkout:** Seamless Cart UX that persists data across pages.
- **Mock Payment Gateway:** Fully designed Checkout simulation supporting Mock Credit Card, UPI/QR, and Cash on Delivery methods. Includes dynamic Coupon Code mechanics (e.g. `FARM10`).
- **Order Tracking:** After checkout, buyers can monitor the lifecycle of their fresh produce order.
- **Wishlist & Reviews:** Engage with farms by saving crops for later or adding star reviews.

---

## ⚙️ How It Works (The Process)

1. **Database Layer:** The database schema is cleanly orchestrated using `schema.prisma`. All relational logic (Farmers ➔ Products ➔ Orders ➔ Customers) is handled safely by the ORM.
2. **API Layer:** Client components talk to lightweight API endpoints in `app/api`. E.g., pressing "Place Order" hits `/api/orders`, which uses Prisma to validate the cart, create the invoice, and update stock synchronously.
3. **Session State:** When a user logs in, the API signs a payload with JWT and attaches it to a secure cookie. Every sensitive route (like `/farmer/dashboard`) reads this cookie natively to ascertain permissions without heavy client-side loading screens.
4. **Zero-Config Script:** A custom `run_project.bat` acts as the entry point, resolving Prisma DB checks and spinning up the Next.js server instantly for local showcase.

---

## 🛠️ Installation & Setup

1. **Clone the Repository** (or unzip the project folder).
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Initialize the Database:**
   ```bash
   npx prisma db push
   ```
4. **Seed Mock Data (Optional):**
   *(If you want to pre-fill the database with farmers, customers, and vegetables)*
   ```bash
   node seed.js
   ```
5. **Run the Application:**
   ```bash
   npm run dev
   ```
   *Navigate to `http://localhost:3000` in your browser.*

---

## 🔮 Future Expansion Ideas
While fully functional, the project architecture allows for enterprise scaling:
- **Database Migration:** Prisma allows swapping SQLite for **PostgreSQL** purely by changing one line in the `.env` context.
- **Real Payments:** The current mock checkout can easily be strapped to **Stripe API** by intercepting the `/api/orders` payload.
- **Live Notifications:** Hooking the order APIs up to **Resend** or **Twilio** for email/SMS alerts.
