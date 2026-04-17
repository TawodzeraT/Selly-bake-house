// ================================================================
// SELLY BAKE HOUSE — CART JS
// Date/time picker, map, tips, payment methods, geo check
// ================================================================

var geoResult        = null;
var selectedTipPct   = 0;
var customTipAmt     = 0;
var deliveryMap      = null;
var deliveryMarker   = null;
var geocodeTimer     = null;

document.addEventListener("DOMContentLoaded", function() {
  renderCart();
  initDeliveryOptions();
  initPaymentOptions();
  setupMinDates();
  loadDeliveryFeeLabel();
});

// ── RENDER CART ──────────────────────────────────────────────────
function renderCart() {
  var cart     = SBH.getCart();
  var products = SBH.getProducts();
  var empty    = document.getElementById("cart-empty");
  var main     = document.getElementById("cart-main");
  var summary  = document.getElementById("cart-summary");

  if (cart.length === 0) {
    if (empty)   empty.style.display   = "block";
    if (main)    main.style.display    = "none";
    if (summary) summary.style.display = "none";
    return;
  }

  if (empty)   empty.style.display   = "none";
  if (main)    main.style.display    = "grid";
  if (summary) summary.style.display = "block";

  var cartList = document.getElementById("cart-items");
  if (!cartList) return;

  cartList.innerHTML = cart.map(function(item) {
    var product   = products.find(function(p) { return p.id === item.id; }) || item;
    var lineTotal = (product.price * item.qty).toFixed(2);
    return '<div class="cart-item" id="cart-item-' + item.id + '">' +
      '<div class="cart-item-emoji">' + item.emoji + '</div>' +
      '<div class="cart-item-info">' +
        '<div class="cart-item-name">' + item.name + '</div>' +
        '<div class="cart-item-price">$' + parseFloat(product.price).toFixed(2) + ' each</div>' +
      '</div>' +
      '<div class="cart-item-qty">' +
        '<button class="qty-btn" onclick="changeQty(' + item.id + ',' + (item.qty - 1) + ')">−</button>' +
        '<span class="qty-num">' + item.qty + '</span>' +
        '<button class="qty-btn" onclick="changeQty(' + item.id + ',' + (item.qty + 1) + ')">+</button>' +
      '</div>' +
      '<span class="cart-item-total">$' + lineTotal + '</span>' +
      '<button class="cart-remove-btn" onclick="removeItem(' + item.id + ')" title="Remove">✕</button>' +
    '</div>';
  }).join("");

  updateSummary();
}

function changeQty(productId, newQty) { SBH.updateCartQty(productId, newQty); renderCart(); }
function removeItem(productId) { SBH.removeFromCart(productId); renderCart(); showToast("Item removed."); }

// ── DELIVERY OPTIONS ─────────────────────────────────────────────
function initDeliveryOptions() {
  document.querySelectorAll(".delivery-option").forEach(function(opt) {
    opt.addEventListener("click", function() {
      document.querySelectorAll(".delivery-option").forEach(function(o) { o.classList.remove("selected"); });
      opt.classList.add("selected");
      var radio = opt.querySelector("input[type=radio]");
      if (radio) radio.checked = true;
      selectMethod(opt.dataset.method);
    });
  });
}

function selectMethod(method) {
  var pickupSection   = document.getElementById("pickup-section");
  var deliverySection = document.getElementById("delivery-section");
  var deliveryRow     = document.getElementById("delivery-row");

  if (method === "delivery") {
    if (pickupSection)   pickupSection.style.display   = "none";
    if (deliverySection) deliverySection.style.display = "block";
    if (deliveryRow)     deliveryRow.style.display     = "flex";
    initDeliveryMap();
  } else {
    if (pickupSection)   pickupSection.style.display   = "block";
    if (deliverySection) deliverySection.style.display = "none";
    if (deliveryRow)     deliveryRow.style.display     = "none";
  }
  updateSummary();
}

function getSelectedMethod() {
  var sel = document.querySelector(".delivery-option.selected");
  return sel ? sel.dataset.method : "pickup";
}

// ── LEAFLET MAP ──────────────────────────────────────────────────
function initDeliveryMap() {
  if (deliveryMap) return;
  var settings = SBH.getSettings();
  var lat      = settings.pickupLat || 39.0840;
  var lng      = settings.pickupLng || -77.1528;

  deliveryMap = L.map("delivery-map").setView([lat, lng], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(deliveryMap);

  deliveryMarker = L.marker([lat, lng], { draggable: true })
    .addTo(deliveryMap)
    .bindPopup("Drag me to your exact location!")
    .openPopup();

  deliveryMarker.on("dragend", function(e) {
    var pos = e.target.getLatLng();
    checkDeliveryInMaryland(pos.lat, pos.lng);
  });
}

function geocodeAddress() {
  clearTimeout(geocodeTimer);
  geocodeTimer = setTimeout(function() {
    var addr = document.getElementById("delivery-address-input").value.trim();
    if (!addr || addr.length < 5) return;
    if (!deliveryMap) initDeliveryMap();

    fetch("https://nominatim.openstreetmap.org/search?format=json&q=" + encodeURIComponent(addr + ", Maryland, USA") + "&limit=1")
      .then(function(r) { return r.json(); })
      .then(function(results) {
        if (results && results[0]) {
          var lat = parseFloat(results[0].lat);
          var lng = parseFloat(results[0].lon);
          deliveryMap.setView([lat, lng], 15);
          deliveryMarker.setLatLng([lat, lng]);
          checkDeliveryInMaryland(lat, lng);
        }
      })
      .catch(function() {});
  }, 800);
}

function checkDeliveryInMaryland(lat, lng) {
  var inMD = lat >= 37.9 && lat <= 39.8 && lng >= -79.5 && lng <= -74.9;
  var warn = document.getElementById("delivery-outside-md");
  if (warn) warn.style.display = inMD ? "none" : "block";
  return inMD;
}

// ── DATE / TIME ──────────────────────────────────────────────────
function setupMinDates() {
  var today = new Date().toISOString().split("T")[0];
  var pd    = document.getElementById("pickup-date");
  var dd    = document.getElementById("delivery-date");
  if (pd) pd.min = today;
  if (dd) dd.min = today;
}

function loadDeliveryFeeLabel() {
  var settings = SBH.getSettings();
  var el       = document.getElementById("delivery-fee-label");
  if (el) el.textContent = "$" + (parseFloat(settings.deliveryFee) || 8.99).toFixed(2);
}

function onPickupDateChange() {
  populateTimeSlots("pickup-date", "pickup-time");
  var dateVal     = document.getElementById("pickup-date").value;
  var blocked     = SBH.isDateBlocked(dateVal);
  var warning     = document.getElementById("blocked-date-warning");
  var hintEl      = document.getElementById("pickup-date-hint");
  if (warning) warning.style.display = blocked ? "block" : "none";
  if (hintEl)  hintEl.textContent    = blocked ? "" : "";
}

function onDeliveryDateChange() {
  populateTimeSlots("delivery-date", "delivery-time");
}

function populateTimeSlots(dateId, timeId) {
  var settings    = SBH.getSettings();
  var startHour   = settings.pickupStartHour || 9;
  var endHour     = settings.pickupEndHour   || 18;
  var slots       = SBH.generateTimeSlots(startHour, endHour);
  var selectEl    = document.getElementById(timeId);
  var dateVal     = document.getElementById(dateId).value;

  if (!selectEl) return;
  if (!dateVal) { selectEl.innerHTML = '<option value="">Select a date first</option>'; return; }

  if (SBH.isDateBlocked(dateVal)) {
    selectEl.innerHTML = '<option value="">Date not available</option>';
    return;
  }

  selectEl.innerHTML = '<option value="">Choose a time</option>' +
    slots.map(function(s) { return '<option value="' + s + '">' + s + '</option>'; }).join("");
}

// ── TIP ──────────────────────────────────────────────────────────
function setTip(value) {
  document.querySelectorAll(".tip-btn").forEach(function(b) {
    b.classList.remove("btn-primary");
    b.classList.add("btn-outline");
  });

  var customBox = document.getElementById("custom-tip-box");
  if (value === "custom") {
    if (customBox) customBox.style.display = "block";
    document.getElementById("tip-custom").classList.remove("btn-outline");
    document.getElementById("tip-custom").classList.add("btn-primary");
    selectedTipPct = 0;
  } else {
    if (customBox) customBox.style.display = "none";
    selectedTipPct = value;
    customTipAmt   = 0;
    var btnId = value === 0 ? "tip-none" : "tip-" + value;
    var btn   = document.getElementById(btnId);
    if (btn) { btn.classList.remove("btn-outline"); btn.classList.add("btn-primary"); }
  }
  updateSummary();
}

function updateCustomTip() {
  customTipAmt = parseFloat(document.getElementById("custom-tip-input").value) || 0;
  updateSummary();
}

function getTipAmount() {
  var subtotal = SBH.getCartTotal();
  if (selectedTipPct === "custom" || selectedTipPct === 0 && customTipAmt > 0) return customTipAmt;
  if (selectedTipPct > 0) return subtotal * (selectedTipPct / 100);
  return customTipAmt;
}

// ── PAYMENT OPTIONS ──────────────────────────────────────────────
function initPaymentOptions() {
  document.querySelectorAll(".payment-option").forEach(function(opt) {
    opt.addEventListener("click", function() {
      document.querySelectorAll(".payment-option").forEach(function(o) {
        o.style.borderColor = "var(--cream-dark)";
        o.style.background  = "var(--white)";
      });
      opt.style.borderColor = "var(--rose-deep)";
      opt.style.background  = "var(--rose-light)";
      selectPayment(opt.dataset.method);
    });
  });
}

function selectPayment(method) {
  var cashappInfo = document.getElementById("cashapp-info");
  var cashInfo    = document.getElementById("cash-info");
  if (cashappInfo) cashappInfo.style.display = method === "cashapp" ? "block" : "none";
  if (cashInfo)    cashInfo.style.display    = method === "cash"    ? "block" : "none";
}

function getSelectedPayment() {
  var sel = document.querySelector(".payment-option[style*='border-color: var(--rose-deep)']");
  if (sel) return sel.dataset.method;
  var checked = document.querySelector("input[name='payment']:checked");
  return checked ? checked.value : "square";
}

// ── SUMMARY UPDATE ───────────────────────────────────────────────
function updateSummary() {
  var settings  = SBH.getSettings();
  var subtotal  = SBH.getCartTotal();
  var method    = getSelectedMethod();
  var delivFee  = method === "delivery" ? (parseFloat(settings.deliveryFee) || 8.99) : 0;
  var tax       = subtotal * 0.06;
  var tip       = getTipAmount();
  var total     = subtotal + delivFee + tax + tip;

  var setEl = function(id, val) { var e = document.getElementById(id); if (e) e.textContent = val; };
  setEl("summary-subtotal", formatCurrency(subtotal));
  setEl("summary-delivery", formatCurrency(delivFee));
  setEl("summary-tax",      formatCurrency(tax));
  setEl("summary-tip",      formatCurrency(tip));
  setEl("summary-total",    formatCurrency(total));

  var delivRow = document.getElementById("delivery-row");
  var tipRow   = document.getElementById("tip-row");
  if (delivRow) delivRow.style.display = method === "delivery" ? "flex" : "none";
  if (tipRow)   tipRow.style.display   = tip > 0 ? "flex" : "none";
}

function formatCurrency(n) {
  return "$" + parseFloat(n || 0).toFixed(2);
}

// ── GEO CHECK ────────────────────────────────────────────────────
async function runGeoCheck() {
  var btn = document.getElementById("geo-check-btn");
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Checking...'; }
  showGeoBanner("checking");

  try { geoResult = await checkMarylandGeo(); }
  catch { geoResult = false; }

  if (btn) btn.style.display = "none";
  showGeoBanner(geoResult ? "ok" : "fail");
  updateCheckoutBtn();
}

function showGeoBanner(state) {
  var container = document.getElementById("geo-banner-container");
  if (!container) return;
  var banners = {
    checking: '<div class="geo-banner geo-checking"><span class="geo-icon">📍</span><div><strong>Checking your location...</strong>This only takes a second.</div></div>',
    ok:       '<div class="geo-banner geo-ok"><span class="geo-icon">✅</span><div><strong>Maryland confirmed!</strong>You are eligible for pickup and delivery. Ready to checkout!</div></div>',
    fail:     '<div class="geo-banner geo-fail"><span class="geo-icon">📍</span><div><strong>Outside our service area</strong>Sorry, we currently only serve customers in Maryland. Your location is too far.<br><small style="opacity:.8">If you believe this is an error please <a href="contact.html" style="color:inherit;font-weight:700">contact us</a>.</small></div></div>'
  };
  container.innerHTML = banners[state] || "";
}

function updateCheckoutBtn() {
  var btn = document.getElementById("checkout-btn");
  if (!btn) return;
  if (geoResult === true) {
    btn.disabled    = false;
    btn.textContent = "Place Order";
    btn.onclick     = initiateCheckout;
  } else {
    btn.disabled    = true;
    btn.textContent = "Unavailable Outside Maryland";
  }
}

// ── CHECKOUT ─────────────────────────────────────────────────────
async function initiateCheckout() {
  var method      = getSelectedMethod();
  var payMethod   = getSelectedPayment();
  var settings    = SBH.getSettings();

  // Validation
  if (method === "pickup") {
    var pickupDate = document.getElementById("pickup-date").value;
    var pickupTime = document.getElementById("pickup-time").value;
    if (!pickupDate) { showToast("Please select a pickup date."); return; }
    if (!pickupTime) { showToast("Please select a pickup time."); return; }
    if (SBH.isDateBlocked(pickupDate)) { showToast("Sorry that date is not available. Please choose another date."); return; }
  }

  if (method === "delivery") {
    var delivAddr = document.getElementById("delivery-address-input").value.trim();
    var delivDate = document.getElementById("delivery-date").value;
    var delivTime = document.getElementById("delivery-time").value;
    if (!delivAddr) { showToast("Please enter your delivery address."); return; }
    if (!delivDate) { showToast("Please select a delivery date."); return; }
    if (!delivTime) { showToast("Please select a delivery time."); return; }
    if (SBH.isDateBlocked(delivDate)) { showToast("Sorry that date is not available. Please choose another date."); return; }
  }

  var btn = document.getElementById("checkout-btn");
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Processing...'; }

  // Build order object
  var cart    = SBH.getCart();
  var user    = SBH.getUser();
  var subtotal = SBH.getCartTotal();
  var delivFee = method === "delivery" ? (parseFloat(settings.deliveryFee) || 8.99) : 0;
  var tax      = subtotal * 0.06;
  var tip      = getTipAmount();
  var total    = subtotal + delivFee + tax + tip;

  var order = {
    id:              "SBH" + Date.now(),
    customer:        user ? user.name  : "Guest",
    email:           user ? user.email : "",
    phone:           user ? user.phone : "",
    items:           cart.map(function(i) { return i.name + " x" + i.qty; }).join(", "),
    itemDetails:     cart,
    subtotal:        subtotal,
    tax:             tax,
    tip:             tip,
    total:           total,
    status:          "pending",
    date:            new Date().toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }),
    method:          method,
    paymentMethod:   payMethod,
    pickupDate:      method === "pickup"   ? (document.getElementById("pickup-date").value)   : "",
    pickupTime:      method === "pickup"   ? (document.getElementById("pickup-time").value)   : "",
    deliveryDate:    method === "delivery" ? (document.getElementById("delivery-date").value) : "",
    deliveryTime:    method === "delivery" ? (document.getElementById("delivery-time").value) : "",
    deliveryAddress: method === "delivery" ? ((document.getElementById("delivery-address-input").value.trim()) + (document.getElementById("delivery-apt").value.trim() ? ", " + document.getElementById("delivery-apt").value.trim() : "")) : "",
    deliveryInstructions: method === "delivery" ? (document.getElementById("delivery-instructions").value.trim()) : "",
    deliveryLat:     deliveryMarker ? deliveryMarker.getLatLng().lat : null,
    deliveryLng:     deliveryMarker ? deliveryMarker.getLatLng().lng : null,
  };

  // Save order
  var orders = SBH.getOrders();
  orders.unshift(order);
  SBH.saveOrders(orders);

  // Send confirmation email + SMS
  await sendOrderEmail(order, "new");
  await sendSMSNotification("New order #" + order.id + " from " + order.customer + " — Total: $" + total.toFixed(2) + " — " + method);

  SBH.clearCart();

  // Route to payment
  if (payMethod === "square" || payMethod === "applepay" || payMethod === "googlepay") {
    var squareLink = settings.squareLink;
    if (squareLink) {
      setTimeout(function() { window.location.href = squareLink + "?orderId=" + order.id; }, 800);
    } else {
      window.location.href = "order-success.html?order=" + order.id;
    }
  } else if (payMethod === "cashapp") {
    var cashappLink = settings.cashappLink;
    if (cashappLink) {
      window.location.href = cashappLink;
    } else {
      window.location.href = "order-success.html?order=" + order.id;
    }
  } else {
    // Cash — go to success page
    window.location.href = "order-success.html?order=" + order.id;
  }
}
