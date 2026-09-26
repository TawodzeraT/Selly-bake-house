# Selly Bake House Web App — v12.27 Preview

This package is the **public preview/demo build** for Selly Bake House.

It is intentionally configured so visitors can browse the storefront, products, pricing, Gallery, About page, and Custom Cakes information, while online ordering remains unavailable.

## Preview behavior

- Top status bar reads **WEBSITE PREVIEW — Online ordering is coming soon**.
- The Home page includes a light-green moving **PUBLIC PREVIEW** ribbon.
- The header action is **BROWSE MENU** and jumps directly to the product catalog.
- Shop products remain visible with prices, variants, product zoom, and descriptions.
- Product cards display **Ordering Coming Soon** instead of active Add controls.
- Product popups display **Online Ordering Coming Soon**.
- Cart, checkout, customer account, and admin navigation controls are hidden.
- Direct attempts to open checkout, confirmation, account, or admin routes are redirected to public pages.
- Custom Cakes remains visible for browsing, but the submission button is disabled and the JavaScript submission path is blocked.
- Home slideshow ghost/overlap behavior is prevented in preview mode.
- Existing mobile/tablet/desktop responsive behavior from v12.26 is preserved.

## Important GitHub/Firebase note

This ZIP does **not** include the `assets/` directory or your domain configuration.

When updating the public GitHub repository:

1. Keep the existing `assets/` folder.
2. Keep your existing `CNAME` file if GitHub Pages is using your custom domain.
3. Replace `index.html` and `scripts.js` with the files in this package.
4. If you keep the Node source in the repository, you may also replace `server.js` and `package.json` with these preview-safe versions.
5. Do not upload `.env`, runtime `data/`, administrator credentials, customer records, or service-account private keys.

## Preview-only safety switch

Both the browser script and included Node server source contain an explicit preview-mode safeguard. This package is **not the production ordering build**.

Before production launch, preview mode must be deliberately removed as part of the production/security phase rather than simply toggling a visible button.

## Assets

Keep your existing complete website `assets/` directory in place. The preview source expects the same asset paths used by v12.26.

## Local syntax check

```bash
npm run check
```

This runs:

```bash
node --check scripts.js
node --check server.js
```

## Privacy

Never publish:

- `.env`
- `data/`
- `ADMIN_FIRST_LOGIN.txt`
- runtime `database.json`
- Square access tokens
- Firebase Admin/service-account private keys
- Google server keys
- customer records
