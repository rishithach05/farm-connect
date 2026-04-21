# 🌾 Farm Connect — Setup Guide for Teammates

> **IMPORTANT:** This is a Next.js app. Do NOT open HTML files directly in the browser. You must run the dev server.

## Prerequisites
- [Node.js v18+](https://nodejs.org/) installed
- A terminal (VS Code Terminal, PowerShell, or Command Prompt)

---

## Steps to Run Locally

### Step 1: Open the folder in your terminal
```bash
cd "Farm connect"
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Create the `.env` file
Create a new file named `.env` in the root folder with this content:
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="super-secret-farm-connect-key-2026"
```

### Step 4: Set up the database
```bash
npx prisma generate
npx prisma migrate deploy
```

### Step 5: Seed the database (to see products)
```bash
node seed.js
```

### Step 6: Start the app
```bash
npm run dev
```

### Step 7: Open in browser
Go to 👉 **http://localhost:3000**

---

## ⚠️ Common Mistakes
| Mistake | Fix |
|---|---|
| Opening an HTML file directly | Run `npm run dev` and go to `http://localhost:3000` |
| "Module not found" error | Run `npm install` first |
| "Database not found" error | Run `npx prisma migrate deploy` and `node seed.js` |
| Blank page or crash | Make sure the `.env` file exists with the content above |
