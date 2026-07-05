# AuraMart

A full-stack e-commerce platform consisting of a customer-facing storefront, an admin panel, and a shared Node.js/Express backend.

**Live:**
- Storefront: https://auramart-shopping.onrender.com
- Admin panel: https://auramart-wjkw.onrender.com
- Backend API: https://auramart-backend-vl5j.onrender.com

## Project structure

```
AuraMart-Shopping/
├── AuraMart/               # Customer storefront (React + Vite)
├── AuraMart-Admin-Panel/   # Admin dashboard (React + Vite)
├── backend/                # REST API (Express + MongoDB/Mongoose)
└── render.yaml             # Render Blueprint for deploying all three services
```

## Tech stack

- **Frontend (storefront & admin):** React 19, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express 5, MongoDB (Mongoose)
- **Auth:** JWT, email OTP, Google OAuth
- **Integrations:** Razorpay (payments), Cloudinary (media), Twilio (SMS), Nodemailer (email)

## Features

- **Storefront:** product catalog with filtering, collections, accessories, product customization, cart, wishlist, coupons, promotional events/banners, checkout with Razorpay, order tracking, user auth (OTP/Google/password), profile & address management.
- **Admin panel:** product/accessory/collection management, stock/kist management, order management, coupon/banner/event management, role & permission management, employee management, barcode generation.

## Local setup

Each service has its own dependencies and `.env` file — none are committed to git.

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```
MONGODB_URI=
PORT=4050
JWT_SECRET=
COOKIE_EXPIRE=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
RESEND_API_KEY=
MAIL_FROM=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

```bash
npm start   # nodemon index.js — http://localhost:4050
```

> **Email:** OTP/verification emails are sent via [Resend](https://resend.com) rather than raw SMTP — Render's free-tier network can't reliably reach Gmail's SMTP servers, which caused connection timeouts. Sign up at resend.com and set `RESEND_API_KEY`. Without a verified domain, the default sandbox sender (`onboarding@resend.dev`) can only deliver to the email address you signed up to Resend with — verify a domain (set `MAIL_FROM` to an address on it) before relying on this for real user signups.

### Storefront (AuraMart)

```bash
cd AuraMart
npm install
```

Create `AuraMart/.env`:

```
VITE_API_URL=http://localhost:4050
VITE_RAZORPAY_KEY_ID=
```

```bash
npm run dev   # http://localhost:5173
```

### Admin panel (AuraMart-Admin-Panel)

```bash
cd AuraMart-Admin-Panel
npm install
```

Create `AuraMart-Admin-Panel/.env`:

```
VITE_API_URL=http://localhost:4050
```

```bash
npm run dev
```

## Deployment

All three services deploy to Render via the [render.yaml](render.yaml) Blueprint at the repo root:

- `auramart-backend` — Node web service
- `auramart-frontend` — static site (storefront)
- `auramart-admin-panel` — static site (admin)

To deploy: push to `main`, then in the Render dashboard use **New → Blueprint**, select this repo, and fill in the secret environment variables when prompted (Mongo URI, JWT secret, Cloudinary/Twilio/Razorpay/Google/Mail credentials).

Notes:
- `VITE_API_URL` / `VITE_RAZORPAY_KEY_ID` are baked into the frontend bundles at **build time** — changing them in Render requires a redeploy (Manual Deploy → Deploy latest commit) to take effect, not just a settings save.
- Both static sites need a rewrite rule (`/*` → `/index.html`) under **Redirects/Rewrites** so client-side routing doesn't 404 on refresh — already configured in `render.yaml`.
