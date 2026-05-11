# RecoMart — AI-Based E-commerce Platform

A full-stack multi-vendor e-commerce web application with AI-powered product classification, smart search, visual search, personalized recommendations, and an intelligent chatbot.

**Built by:** Muhammad Abdullah, Syed Saifullah Bukhari, Muhammad Hobaib
**University:** COMSATS University Islamabad, Wah Campus

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Zustand, React Router v6, Recharts, React Hook Form + Zod |
| **Backend** | Node.js 20+, Express.js 5, Mongoose 8 |
| **Database** | MongoDB Atlas (cloud) |
| **AI** | Google Gemini API (gemini-2.0-flash) |
| **Payments** | Stripe |
| **Image Storage** | Cloudinary |
| **Email** | Nodemailer (Gmail SMTP) |

---

## Prerequisites

Before you start, make sure you have these installed on your computer:

1. **Node.js (v20 or higher)**
   - Download from: https://nodejs.org
   - Verify: open terminal and run `node --version` (should show v20.x.x or higher)

2. **npm** (comes with Node.js)
   - Verify: `npm --version`

3. **Git** (optional, for cloning)
   - Download from: https://git-scm.com

---

## Step 1: Install Dependencies

Open your terminal and navigate to the project folder:

```bash
cd recomart
```

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

---

## Step 2: Set Up External Services

You need to create free accounts on 4 services and get API keys. Follow each guide below.

### 2.1 — MongoDB Atlas (Database) — REQUIRED

This is where all your data is stored. **The app will not work without this.**

1. Go to **https://www.mongodb.com/atlas**
2. Click **"Try Free"** and create an account
3. Once logged in, click **"Create Deployment"** (or "Build a Cluster")
4. Choose the **FREE / M0** tier, pick any region, click **"Create Deployment"**
5. It will ask you to create a **Database User**:
   - Set a username (e.g., `recomart`)
   - Set a password (click **Auto Generate** is easiest — **copy this password!**)
   - Click **"Create Database User"**
6. Next it asks **"Where would you like to connect from?"**:
   - Click **"Add My Current IP Address"**
   - Also add `0.0.0.0/0` to allow access from anywhere (useful for deployment)
   - Click **"Finish and Close"**
7. On the Clusters page, click **"Connect"** → **"Drivers"**
8. Copy the connection string. It looks like:
   ```
   mongodb+srv://recomart:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
9. Replace `<password>` with your actual password
10. Add `/recomart` before the `?` to set the database name:
    ```
    mongodb+srv://recomart:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/recomart?retryWrites=true&w=majority
    ```

**Save this connection string — you'll need it in Step 3.**

---

### 2.2 — Google Gemini API Key (AI Features) — RECOMMENDED

Powers the AI chatbot, smart search, product classification, and visual search.

1. Go to **https://aistudio.google.com/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Select any Google Cloud project (or let it create one)
5. **Copy the API key**

> **Note:** The app works without this key, but AI features (chatbot, smart search, image classification) will not function.

---

### 2.3 — Cloudinary (Image Storage) — RECOMMENDED

Used for uploading and storing product images.

1. Go to **https://cloudinary.com** and click **"Sign Up Free"**
2. Create an account
3. Once logged in, go to the **Dashboard**
4. You'll see three values right on the dashboard:
   - **Cloud Name** (e.g., `dxxxxxxxx`)
   - **API Key** (a number like `123456789012345`)
   - **API Secret** (click the eye icon to reveal it)
5. **Copy all three values**

> **Note:** Without Cloudinary, image uploads won't work. Products will still function but without images.

---

### 2.4 — Stripe (Payments) — OPTIONAL

Used for online card payments. You can skip this and use "Cash on Delivery" instead.

1. Go to **https://stripe.com** and click **"Start now"**
2. Create an account and verify your email
3. You do **NOT** need to activate your business — test mode is enough
4. Make sure **"Test mode"** is ON (toggle in the top-right corner)
5. Go to **Developers** → **API Keys**:
   - Copy the **Publishable key** (starts with `pk_test_...`)
   - Copy the **Secret key** (click "Reveal" — starts with `sk_test_...`)

**For Stripe Webhooks (advanced — needed for payment confirmation):**

6. Install Stripe CLI: https://stripe.com/docs/stripe-cli
7. Run: `stripe listen --forward-to localhost:5000/api/payments/webhook`
8. It will display a webhook signing secret (starts with `whsec_...`) — copy it

> **Note:** Without Stripe, the "Pay with Card" option won't work, but "Cash on Delivery" will work fine.

---

### 2.5 — Gmail SMTP (Emails) — OPTIONAL

Used for sending order confirmation emails, status updates, etc.

1. Go to **https://myaccount.google.com/security**
2. Make sure **2-Step Verification** is turned ON
3. Go to **https://myaccount.google.com/apppasswords**
4. Select app: **Mail**, device: **Other** (name it "RecoMart")
5. Click **Generate**
6. You'll get a **16-character password** — copy it

> **Note:** Without this, the app works fine — emails just won't be sent.

---

## Step 3: Configure Environment Variables

### Backend (.env)

Go to the `server/` folder and create a file called `.env`:

```bash
cd server
cp .env.example .env
```

Now open `server/.env` in any text editor and fill in your values:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB — REQUIRED (paste your connection string from Step 2.1)
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/recomart?retryWrites=true&w=majority

# JWT (you can keep these as-is or generate your own random strings)
JWT_SECRET=paste_any_random_64_character_string_here_abcdef1234567890
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=paste_another_random_64_character_string_here_1234567890ab
JWT_REFRESH_EXPIRE=30d

# Cloudinary — paste values from Step 2.3 (leave as-is if skipping)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe — paste values from Step 2.4 (leave as-is if skipping)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_SUCCESS_URL=http://localhost:5173/payment-success
STRIPE_CANCEL_URL=http://localhost:5173/cart

# Google Gemini AI — paste value from Step 2.2 (leave as-is if skipping)
GEMINI_API_KEY=your_gemini_api_key

# Email — paste values from Step 2.5 (leave as-is if skipping)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_char_app_password

# Frontend URL
CLIENT_URL=http://localhost:5173
```

**To generate random JWT secrets**, you can run this in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Run it twice — once for JWT_SECRET, once for JWT_REFRESH_SECRET.

### Frontend (.env)

Open `client/.env` and update if needed:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_your_publishable_key_here
```

---

## Step 4: Seed the Database

This creates an admin account, categories, a demo seller, and 30 sample products:

```bash
cd server
npm run seed:all
```

You should see output like:
```
Admin created: admin@recomart.com / Admin@123456
Created: Electronics with 7 subcategories
Created: Clothing with 5 subcategories
...
Seeding complete! Total categories: 55
Demo seller created: seller@recomart.com / Seller@123456
Seeded 30 products successfully!
```

---

## Step 5: Run the Application

You need **two terminal windows** — one for the backend, one for the frontend.

### Terminal 1 — Start Backend:

```bash
cd recomart/server
npm run dev
```

You should see:
```
MongoDB connected: ...
Server running in development mode on port 5000
```

### Terminal 2 — Start Frontend:

```bash
cd recomart/client
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜ Local: http://localhost:5173/
```

### Open the App:

Go to **http://localhost:5173** in your browser.

---

## Step 6: Login & Test

### Default Accounts:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@recomart.com | Admin@123456 |
| **Seller** | seller@recomart.com | Seller@123456 |

Or click **Register** to create a new customer account.

### Test Flows:

1. **Customer Flow:** Register → Browse Products → Search → Add to Cart → Checkout → Place Order
2. **Seller Flow:** Login as seller → Dashboard → Add Product → Manage Orders → View Analytics
3. **Admin Flow:** Login as admin → Dashboard → Approve Products/Sellers → Manage Users → View Reports
4. **AI Features:** Try the chatbot (blue bubble bottom-right), search for products, upload an image to search

### Stripe Test Card:
When testing card payments, use:
- Card number: `4242 4242 4242 4242`
- Expiry: any future date (e.g., `12/34`)
- CVC: any 3 digits (e.g., `123`)

---

## Project Structure

```
recomart/
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── api/                # Axios instance with JWT interceptors
│   │   ├── components/         # Reusable UI components
│   │   │   ├── admin/          # Admin panel components
│   │   │   ├── cart/           # Cart components
│   │   │   ├── chat/           # AI Chatbot widget
│   │   │   ├── checkout/       # Checkout flow components
│   │   │   ├── common/         # Navbar, Footer, Loader, etc.
│   │   │   ├── home/           # Homepage sections
│   │   │   ├── product/        # Product cards, filters, gallery
│   │   │   └── seller/         # Seller panel components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Page components
│   │   │   ├── admin/          # Admin dashboard pages
│   │   │   ├── customer/       # Customer pages (cart, orders, etc.)
│   │   │   ├── public/         # Public pages (home, login, etc.)
│   │   │   └── seller/         # Seller dashboard pages
│   │   ├── store/              # Zustand state management
│   │   ├── utils/              # Utility functions
│   │   ├── App.jsx             # Main app with routing
│   │   └── main.jsx            # Entry point
│   └── .env                    # Frontend environment variables
│
├── server/                     # Node.js Backend (Express)
│   ├── config/                 # DB, Cloudinary, Stripe, Gemini config
│   ├── controllers/            # Route handlers (16 controllers)
│   ├── middleware/              # Auth, role check, validation, upload
│   ├── models/                 # Mongoose schemas (11 models)
│   ├── routes/                 # Express routes (16 route files)
│   ├── seed/                   # Database seed scripts
│   ├── services/               # Business logic (AI, payments, email)
│   ├── utils/                  # Error classes, validators
│   ├── app.js                  # Express app setup
│   ├── server.js               # Entry point
│   └── .env                    # Backend environment variables
│
└── README.md                   # This file
```

---

## AI Features

| Feature | How It Works |
|---------|-------------|
| **Product Classification** | When a seller adds a product, Gemini AI automatically classifies it into a category and generates search tags |
| **Smart Search** | Gemini understands natural language queries like "red shoes under 5000" and extracts filters |
| **Visual Search** | Upload a product image and AI finds similar products in the store |
| **Chatbot** | AI shopping assistant (bottom-right chat bubble) helps customers find products and answers questions |
| **Recommendations** | Personalized "For You" recommendations based on purchase history and wishlist |

---

## API Endpoints Overview

| Module | Base Route | Endpoints |
|--------|-----------|-----------|
| Auth | `/api/auth` | Register, Login, Refresh Token, Logout, Get Me |
| Users | `/api/users` | Profile, Password, Addresses |
| Products | `/api/products` | CRUD, Seller Products, Filter/Sort/Paginate |
| Categories | `/api/categories` | CRUD, Tree Structure |
| Cart | `/api/cart` | Get, Add, Update, Remove, Clear |
| Orders | `/api/orders` | Create, My Orders, Seller Orders, Cancel, Status Update |
| Reviews | `/api/reviews` | Get by Product, Create, Delete |
| Wishlist | `/api/wishlist` | Get, Toggle |
| Payments | `/api/payments` | Stripe Checkout, Webhook, Verify |
| Search | `/api/search` | Text Search, Image Search, Suggestions |
| Recommendations | `/api/recommendations` | For You, Similar, Trending |
| Chatbot | `/api/chatbot` | Send Message |
| Seller | `/api/seller` | Register, Dashboard, Analytics, Profile, Store |
| Admin | `/api/admin` | Dashboard, Users, Sellers, Products, Orders, Reports |
| Notifications | `/api/notifications` | Get, Mark Read, Mark All Read |
| Upload | `/api/upload` | Single Image, Multiple Images, Delete |

---

## Troubleshooting

### "Cannot connect to MongoDB"
- Check your `MONGODB_URI` in `server/.env` — make sure the password is correct and has no `< >` brackets
- Make sure your IP is whitelisted in MongoDB Atlas (Network Access → Add `0.0.0.0/0` to allow all)

### "Port 5000 already in use"
- Another process is using port 5000. Kill it: `lsof -ti:5000 | xargs kill`
- Or change the PORT in `server/.env`

### "CORS error in browser"
- Make sure `CLIENT_URL` in `server/.env` matches your frontend URL (`http://localhost:5173`)
- Make sure the backend is actually running

### "AI features not working"
- Check that `GEMINI_API_KEY` is set correctly in `server/.env`
- The free Gemini API has rate limits — wait a moment and try again

### "Image upload not working"
- Check that all three Cloudinary values are set in `server/.env`
- Make sure your Cloudinary account is active

### "Payments not working"
- Make sure Stripe keys are in test mode (start with `pk_test_` and `sk_test_`)
- For webhook confirmation, you need Stripe CLI running locally

### Mongoose "Duplicate schema index" warnings
- These are harmless warnings and do not affect functionality. You can ignore them.

---

## npm Scripts

### Backend (`server/`)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start server in development mode (auto-restart on changes) |
| `npm start` | Start server in production mode |
| `npm run seed:admin` | Create admin account |
| `npm run seed:categories` | Create categories |
| `npm run seed:products` | Create sample products + demo seller |
| `npm run seed:all` | Run all seed scripts |

### Frontend (`client/`)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## License

This project was developed as a Final Year Project (FYP) at COMSATS University Islamabad, Wah Campus.
SHOES
CLOTHES
DRESS
BAGS
LAPTOPS
MOBILES
EARBUDS
POWERBANKS
HEADPHONES
SMARTWATCHES
MAKEUP
HOMEANDLIVING
WATCHES
BABYACCESSORIES
BABYCLOTHING
DECOR
SPORTS
BODYACCESSORIES
ELECTRONICS
HOMEAPPLIANCES
FURNITURE