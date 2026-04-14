// ================================
// SELLY BAKE HOUSE — CART PAGE
// Cart rendering, geo, checkout
// ================================

let geoResult = null; // null = unchecked, true = MD, false = outside MD

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  initDeliveryOptions();
  initGeoCheck();
});

function renderCart() {
  const cart = SBH.getCart();
  const products = SBH.getProducts();
  const main = document.getElementById("cart-main");
  const empty = document.getElementById("cart-empty");
  const summary = document.getElementById("cart-summary");

  if (cart.length === 0) {
    if (main)    main.style.display    = "none";
    if (summary) summary.style.display = "none";
    if (empty)   empty.style.display   = "block";
    return;
  }

  if (empty)   empty.style.display   = "none";
  if (main)    main.style.display    = "block";
  if (summary) summary.style.display = "block";

  const cartList = document.getElementById("cart-items");
  if (!cartList) return;

  cartList.innerHTML = cart.map(item => {
    const product = products.find(p => p.id === item.id) || item;
    const lineTotal = (product.price * item.qty).toFixed(2);
    return `
      <div class="cart-item" id="cart-item-${item.id}">
        <div class="cart-item-emoji">${item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${parseFloat(product.price).toFixed(2)} each</div>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, ${item.qty - 1})">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, ${item.qty + 1})">+</button>
        </div>
        <span class="cart-item-total">$${lineTotal}</span>
        <button class="cart-remove-btn" onclick="removeItem(${item.id})" title="Remove">✕</button>
      </div>
    `;
  }).join("");

  updateSummary();
}

function changeQty(productId, newQty) {
  SBH.updateCartQty(productId, newQty);
  renderCart();
}

function removeItem(productId) {
  SBH.removeFromCart(productId);
  renderCart();
  showToast("Item removed from cart.");
}

function initDeliveryOptions() {
  document.querySelectorAll(".delivery-option").forEach(option => {
    option.addEventListener("click", () => {
      document.querySelectorAll(".delivery-option").forEach(o => o.classList.remove("selected"));
      option.classList.add("selected");
      const radio = option.querySelector("input[type=radio]");
      if (radio) radio.checked = true;
      updateSummary();
    });
  });
}

function getSelectedDelivery() {
  const selected = document.querySelector(".delivery-option.selected");
  return selected ? selected.dataset.method : "pickup";
}

function updateSummary() {
  const subtotal  = SBH.getCartTotal();
  const method    = getSelectedDelivery();
  const settings  = SBH.getSettings();
  const delivFee  = method === "delivery" ? parseFloat(settings.deliveryFee) : 0;
  const tax       = subtotal * 0.06;
  const total     = subtotal + delivFee + tax;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set("summary-subtotal", formatCurrency(subtotal));
  set("summary-delivery", method === "delivery" ? formatCurrency(delivFee) : "Free");
  set("summary-tax",      formatCurrency(tax));
  set("summary-total",    formatCurrency(total));

  const delivRow = document.getElementById("delivery-row");
  if (delivRow) delivRow.style.display = method === "delivery" ? "flex" : "none";
}

function initGeoCheck() {
  const geoBtn = document.getElementById("geo-check-btn");
  if (!geoBtn) return;
  geoBtn.addEventListener("click", async () => {
    showGeoBanner("checking");
    geoBtn.disabled = true;
    geoBtn.innerHTML = '<span class="spinner"></span> Checking location...';

    try {
      geoResult = await checkMarylandGeo();
    } catch {
      geoResult = false;
    }

    geoBtn.style.display = "none";
    showGeoBanner(geoResult ? "ok" : "fail");
    updateCheckoutBtn();
  });
}

function showGeoBanner(state) {
  const container = document.getElementById("geo-banner-container");
  if (!container) return;

  const banners = {
    checking: `
      <div class="geo-banner geo-checking">
        <span class="geo-icon">📍</span>
        <div><strong>Checking your location…</strong>This only takes a second.</div>
      </div>`,
    ok: `
      <div class="geo-banner geo-ok">
        <span class="geo-icon">✅</span>
        <div><strong>Maryland confirmed!</strong>You're eligible for pickup and delivery. Proceed to checkout.</div>
      </div>`,
    fail: `
      <div class="geo-banner geo-fail">
        <span class="geo-icon">📍</span>
        <div>
          <strong>Outside our service area</strong>
          Sorry, we currently only serve customers in Maryland. Your location is too far.
          <br><small style="opacity:.8">If you believe this is an error, please <a href="contact.html" style="color:inherit;font-weight:700">contact us</a>.</small>
        </div>
      </div>`
  };
  container.innerHTML = banners[state] || "";
}

function updateCheckoutBtn() {
  const btn = document.getElementById("checkout-btn");
  if (!btn) return;
  if (geoResult === true) {
    btn.disabled = false;
    btn.textContent = "Pay with Square 🔒";
    btn.onclick = initiateSquareCheckout;
  } else if (geoResult === false) {
    btn.disabled = true;
    btn.textContent = "Unavailable — Outside Maryland";
  }
}

async function initiateSquareCheckout() {
  const btn = document.getElementById("checkout-btn");
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Processing...';

  /* =====================================================
   * SQUARE WEB PAYMENTS SDK INTEGRATION
   * Replace this section with your real Square setup.
   *
   * 1. Sign up at squareup.com/developers
   * 2. Get your Application ID and Location ID
   * 3. Include the Square SDK script:
   *    <script src="https://sandbox.web.squarecdn.com/v1/square.js"></script>
   *    (use https://web.squarecdn.com/v1/square.js for production)
   * 4. Implement the payment form:
   *
   *   const payments = Square.payments(APPLICATION_ID, LOCATION_ID);
   *   const card = await payments.card();
   *   await card.attach('#card-container');
   *
   *   const result = await payments.tokenize(card);
   *   if (result.status === 'OK') {
   *     // Send result.token to your backend
   *     await fetch('/api/process-payment', {
   *       method: 'POST',
   *       headers: {'Content-Type':'application/json'},
   *       body: JSON.stringify({
   *         token: result.token,
   *         amount: Math.round(total * 100),
   *         currency: 'USD',
   *         cart: SBH.getCart(),
   *         delivery: getSelectedDelivery()
   *       })
   *     });
   *   }
   * ===================================================== */

  // --- DEMO: Simulate successful payment ---
  await new Promise(r => setTimeout(r, 1800));

  // Save order to history
  const cart = SBH.getCart();
  const user = SBH.getUser();
  const newOrder = {
    id: `SBH-${Date.now()}`,
    customer: user ? user.name : "Guest",
    email: user ? user.email : "",
    items: cart.map(i => `${i.name} x${i.qty}`).join(", "),
    total: SBH.getCartTotal(),
    status: "pending",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    method: getSelectedDelivery()
  };
  const orders = SBH.getOrders();
  orders.unshift(newOrder);
  SBH.saveOrders(orders);

  SBH.clearCart();
  window.location.href = "order-success.html?order=" + newOrder.id;
}
