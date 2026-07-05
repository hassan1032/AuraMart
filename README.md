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
BREVO_API_KEY=
MAIL_USER=
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

> **Email:** OTP/verification emails send through [Brevo](https://www.brevo.com)'s HTTPS transactional email API rather than raw SMTP — Gmail SMTP timed out consistently on Render (both an IPv6 routing issue and, separately, the SMTP ports appearing blocked outbound). Two one-time setup steps in the Brevo dashboard, or every send fails:
> 1. **Security → Authorised IPs** — turn off the IP allowlist restriction (or add your server's static IP if you have one), otherwise Brevo rejects API calls from Render's IP with a 401.
> 2. **Senders, Domains & Dedicated IPs** — verify `MAIL_USER`'s email address as a sender, otherwise sends fail because the `sender.email` isn't authorized.

> **Email:** OTP/verification emails are sent via Gmail SMTP (port 587, STARTTLS). `MAIL_APP_PASSWORD` must be a Google **App Password** (Google Account → Security → App Passwords), not the account's regular login password. Note: Gmail SMTP has previously timed out when called from Render's network — if OTP emails fail with a connection error in production, that's an outbound network/provider issue, not a code bug; switching to an HTTP-based email API (e.g. Resend, Brevo) is the reliable fix.

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
