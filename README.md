# 🧁 Selly Bake House

**Home of everything toothsome** — A full e-commerce website for Selly Bake House, a home bakery based in Rockville, Maryland.

## 📁 Project Structure
selly-bake-house/
├── index.html           # Homepage
├── shop.html            # Product shop with filters
├── cart.html            # Cart & checkout with geo-restriction
├── custom-cake.html     # Multi-step custom cake order form
├── about.html           # About page
├── gallery.html         # Sweet treats gallery
├── contact.html         # Contact form
├── order-success.html   # Order confirmation page
├── admin/
│   └── index.html       # Admin CMS panel
├── css/
│   ├── style.css        # Main storefront styles
│   └── admin.css        # Admin panel styles
└── js/
├── data.js          # Product data, cart logic, localStorage
├── main.js          # Shared: nav, toasts, auth modals, geo
├── shop.js          # Shop filtering & search
├── cart.js          # Cart rendering & geo-restricted checkout
├── cake.js          # Custom cake multi-step form
└── admin.js         # Full CMS: products, orders, settings
## 🚀 Getting Started

**Just open `index.html` in a browser** — no build step required. All state is stored in `localStorage`.

For best results, serve from a local web server:

```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve .
```

Then open `http://localhost:8080`

## 🔗 Integrations to Wire Up

### 1. Square Payments
Replace the demo checkout in `js/cart.js → initiateSquareCheckout()`:
1. Sign up at [squareup.com/developers](https://squareup.com/developers)
2. Add: `<script src="https://web.squarecdn.com/v1/square.js"></script>`
3. Follow the [Web Payments SDK docs](https://developer.squareup.com/docs/web-payments/overview)

### 2. Email Marketing (SendGrid / Mailgun)
In the Admin Panel → Settings → Weekly Email, connect to your email provider:
- [SendGrid API](https://sendgrid.com/docs)
- [Mailgun API](https://documentation.mailgun.com)
- Weekly email logic is ready — just add a POST `/api/send-email` backend route

### 3. IP Geolocation (Production)
The geo check in `js/main.js → checkMarylandGeo()` uses [ipapi.co](https://ipapi.co) (free tier, 1000 req/day).
For production, upgrade to [ipinfo.io](https://ipinfo.io) or [MaxMind GeoIP2](https://www.maxmind.com).

### 4. Backend / Database
For production, replace `localStorage` with real API calls:
- **Supabase** (Postgres + Auth + Storage) — free tier, very easy
- **Firebase** (Firestore) — Google's real-time database
- **Node.js + Express + MongoDB** — custom backend

## 🔐 Admin Panel

Access the admin panel at: `/admin/index.html`

**Features:**
- 📊 Dashboard with revenue stats and recent orders
- 🧁 Full product management (add, edit, toggle status)
- 📦 Order management with status updates
- 🎂 Custom cake request review (approve / reject)
- 📈 Analytics with weekly revenue chart
- ⚙️ Settings: toggle cake orders, email marketing, delivery zones
- 📧 Weekly email preview

> **Production note:** Add authentication to the `/admin` route. Currently open — protect it with a password or session check.

## 📍 Business Info

- **Owner:** Selina Chimukangara
- **Address:** 721 Fallsgrove Dr, Rockville, MD 20850
- **Phone:** (301) 356-1232
- **Email:** sellybakehouse@gmail.com
- **Service Area:** Maryland only (geo-enforced at checkout)

## 🛠 Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript (no frameworks)
- **Fonts:** Cormorant Garamond + Nunito (Google Fonts)
- **State:** localStorage (swap for real DB in production)
- **Payments:** Square Web Payments SDK (stub ready)
- **Geo:** ipapi.co + Browser Geolocation fallback

## 📝 License

© 2025 Selly Bake House. All rights reserved.
