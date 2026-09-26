# Selly Bake House Web App v12.26


## Version 12.25 highlights

- Home slideshow height is reduced on desktop/laptop so the “Start with a favorite” section appears sooner on standard 14-inch screens.
- Custom Cakes Event date starts blank, opens the native calendar, and displays the selected date as **MM/DD/YYYY**.
- Checkout Preferred date starts blank, opens the native calendar, and displays the selected date as **MM/DD/YYYY**.
- Internal date values remain ISO (`YYYY-MM-DD`) so existing browser/server lead-time validation is preserved.

A focused source update for the Selly Bake House storefront. v12.24 adds wider desktop navigation spacing and updates Custom Cakes lead-time wording while preserving the Home slideshow cleanup and ordering behavior from v12.23.

## v12.23 changes

- **Home slideshow spacing:** hidden slideshow panels now occupy the same CSS grid cell instead of stacking vertically and reserving blank space.
- **Home hero height:** removed viewport-forced minimum hero/stage heights so the top of the Home page uses only the space required by the slideshow content and controls.
- **Home controls:** slideshow controls remain in their own row beneath the visible slide, preventing overlap with text, images, buttons, or the scrolling phrase strip.
- **Custom Cakes notice:** added a centered light-green notice directly below the Custom Cakes introduction: “Custom cake requests require at least 1 week of lead time for pickup or delivery.”
- **Responsive behavior:** the new Custom Cakes notice and tightened Home hero spacing include phone/tablet rules.
- Existing one-week custom-cake date enforcement, 24-hour standard-order enforcement, Square COMPLETED-payment protection, pricing, cart, delivery, and customer account logic remain unchanged.

## Important package note

The files supplied for these recent revisions did **not** include the website `assets/` directory. This ZIP is therefore intended as a **drop-in v12.26 source update** for the existing complete website folder. Keep your current `assets/` directory in place.

To apply the update, replace at minimum:

- `index.html`
- `scripts.js`
- `package.json`

`server.js` is included for source continuity and retains the existing server-side lead-time and payment validation.

## Run locally

1. Apply these v12.26 source files to the complete website folder that already contains `assets/`.
2. Keep real credentials only in your private `.env`.
3. Run `node server.js`.
4. Open `http://localhost:3000`.

Do not open `index.html` directly when testing login, admin, address configuration, delivery quotes, or Square checkout.

## Privacy

Do not publish or share `.env`, `data/`, Square access tokens, Google server keys, administrator credentials, or customer records.
