// ================================
// SELLY BAKE HOUSE — MAIN JS
// ================================

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initAuthModals();
  SBH.updateCartBadge();
  setActiveNavLink();
  initToastContainer();
});

// ---- ACTIVE NAV LINK ----
function setActiveNavLink() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-menu a").forEach(a => {
    const href = a.getAttribute("href");
    if (href && href.includes(page)) a.classList.add("active");
  });
}

// ---- MOBILE NAV TOGGLE ----
function initNav() {
  const toggle = document.getElementById("nav-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (toggle && mobileMenu) {
    toggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
    });
  }
  renderUserNav();
}

function renderUserNav() {
  const user = SBH.getUser();
  const loginBtn = document.getElementById("login-btn");
  const userGreeting = document.getElementById("user-greeting");
  const logoutBtn = document.getElementById("logout-btn");
  if (user) {
    if (loginBtn) loginBtn.style.display = "none";
    if (userGreeting) { userGreeting.style.display = "inline"; userGreeting.textContent = `Hi, ${user.name.split(" ")[0]} 👋`; }
    if (logoutBtn) logoutBtn.style.display = "inline-flex";
  } else {
    if (loginBtn) loginBtn.style.display = "inline-flex";
    if (userGreeting) userGreeting.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
}

// ---- TOAST ----
function initToastContainer() {
  if (!document.getElementById("toast-container")) {
    const div = document.createElement("div");
    div.id = "toast-container";
    div.className = "toast-container";
    document.body.appendChild(div);
  }
}

function showToast(message, duration = 2800) {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("removing");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ---- OVERLAY HELPERS ----
function openOverlay(id) {
  const el = document.getElementById(id);
  if (el) { el.style.display = "flex"; document.body.style.overflow = "hidden"; }
}

function closeOverlay(id) {
  const el = document.getElementById(id);
  if (el) { el.style.display = "none"; document.body.style.overflow = ""; }
}

document.addEventListener("click", e => {
  if (e.target.classList.contains("overlay")) {
    e.target.style.display = "none";
    document.body.style.overflow = "";
  }
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    document.querySelectorAll(".overlay").forEach(o => {
      o.style.display = "none";
    });
    document.body.style.overflow = "";
    closeAdminLogin();
  }
});

// ---- AUTH MODALS ----
function initAuthModals() {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;
      if (!email || !password) { showFormError("login-error", "Please fill in all fields."); return; }
      const user = { name: "Customer", email, phone: "" };
      SBH.saveUser(user);
      closeOverlay("login-modal");
      renderUserNav();
      showToast("Welcome back! 👋");
    });
  }

  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", e => {
      e.preventDefault();
      const name  = document.getElementById("signup-name").value.trim();
      const email = document.getElementById("signup-email").value.trim();
      const phone = document.getElementById("signup-phone").value.trim();
      const pass  = document.getElementById("signup-password").value;
      if (!name || !email || !pass) { showFormError("signup-error", "Please fill in all required fields."); return; }
      const user = { name, email, phone };
      SBH.saveUser(user);
      closeOverlay("signup-modal");
      renderUserNav();
      showToast(`Welcome to Selly Bake House, ${name.split(" ")[0]}! 🎉`);
    });
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      SBH.logout();
      renderUserNav();
      showToast("Logged out. See you soon! 👋");
    });
  }

  const toSignup = document.getElementById("to-signup");
  const toLogin  = document.getElementById("to-login");
  if (toSignup) toSignup.addEventListener("click", () => { closeOverlay("login-modal"); openOverlay("signup-modal"); });
  if (toLogin)  toLogin.addEventListener("click",  () => { closeOverlay("signup-modal"); openOverlay("login-modal"); });
}

function showFormError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) { el.textContent = message; el.style.display = "block"; }
}

// ---- GEO CHECK (Maryland only) ----
async function checkMarylandGeo() {
  return new Promise((resolve) => {
    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(data => {
        const state = data.region_code || data.region || "";
        resolve(state === "MD" || state === "Maryland");
      })
      .catch(() => {
        if (!navigator.geolocation) { resolve(true); return; }
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const inMD = lat >= 37.9 && lat <= 39.8 && lon >= -79.5 && lon <= -74.9;
            resolve(inMD);
          },
          () => resolve(true)
        );
      });
  });
}

// ---- PRODUCT CARD BUILDER ----
function buildProductCard(product, options = {}) {
  const { showQuickAdd = true } = options;
  const soldout = product.status === "soldout" || product.status === "outoforder";
  const statusText = product.status === "soldout" ? "Sold Out" : product.status === "outoforder" ? "Unavailable" : "";
  return `
    <div class="product-card" data-id="${product.id}" onclick="openProductModal(${product.id})">
      <div class="product-img">${product.emoji}</div>
      <div class="product-body">
        <div class="product-badges">
          ${product.bestSeller ? '<span class="badge badge-bestseller">⭐ Best Seller</span>' : ""}
          ${product.status === "soldout"    ? '<span class="badge badge-soldout">Sold Out</span>' : ""}
          ${product.status === "outoforder" ? '<span class="badge badge-outoforder">Unavailable</span>' : ""}
          ${product.isNew ? '<span class="badge badge-new">New</span>' : ""}
        </div>
        <div class="product-name">${product.name}</div>
        <div class="product-desc">${product.desc}</div>
        <div class="product-footer">
          <span class="product-price">$${product.price.toFixed(2)}</span>
          ${showQuickAdd ? `
            <button class="btn btn-rose btn-sm"
              onclick="event.stopPropagation(); quickAddToCart(${product.id})"
              ${soldout ? "disabled" : ""}>
              ${soldout ? statusText : "Add to Cart"}
            </button>` : ""}
        </div>
      </div>
    </div>
  `;
}

// ---- PRODUCT MODAL ----
function openProductModal(productId) {
  const product = SBH.getProducts().find(p => p.id === productId);
  if (!product) return;
  const soldout = product.status !== "instock";
  const modalHTML = `
    <div class="overlay" id="product-modal" style="display:flex;">
      <div class="modal" style="max-width:580px;">
        <button class="modal-close" onclick="closeOverlay('product-modal')">✕</button>
        <div class="modal-product-grid">
          <div class="modal-img">${product.emoji}</div>
          <div>
            <div class="detail-category">${product.category}</div>
            <h2 class="serif" style="font-size:1.9rem;color:var(--brown-dark);margin-bottom:.4rem;line-height:1.1">${product.name}</h2>
            <div style="font-size:1.6rem;font-weight:800;color:var(--brown);margin-bottom:.8rem">$${product.price.toFixed(2)}</div>
            <p style="color:var(--text-muted);font-size:.88rem;line-height:1.7;margin-bottom:1rem">${product.longDesc || product.desc}</p>
            ${product.allergens ? `<p style="font-size:.78rem;color:var(--text-muted);margin-bottom:.8rem">⚠️ ${product.allergens}</p>` : ""}
            ${!soldout ? `
              <div class="qty-control">
                <button class="qty-btn" onclick="modalQty(-1)">−</button>
                <span class="qty-num" id="modal-qty">1</span>
                <button class="qty-btn" onclick="modalQty(1)">+</button>
              </div>
              <button class="btn btn-primary btn-block" onclick="modalAddToCart(${product.id})">
                Add to Cart — $<span id="modal-total">${product.price.toFixed(2)}</span>
              </button>
            ` : `
              <button class="btn btn-outline btn-block" disabled>
                ${product.status === "soldout" ? "Currently Sold Out" : "Temporarily Unavailable"}
              </button>
            `}
          </div>
        </div>
      </div>
    </div>
  `;
  const existing = document.getElementById("product-modal");
  if (existing) existing.remove();
  document.body.insertAdjacentHTML("beforeend", modalHTML);
  document.body.style.overflow = "hidden";
  window._modalProductPrice = product.price;
}

function modalQty(delta) {
  const el = document.getElementById("modal-qty");
  const totalEl = document.getElementById("modal-total");
  if (!el) return;
  let qty = parseInt(el.textContent) + delta;
  if (qty < 1) qty = 1;
  el.textContent = qty;
  if (totalEl) totalEl.textContent = (window._modalProductPrice * qty).toFixed(2);
}

function modalAddToCart(productId) {
  const qty = parseInt(document.getElementById("modal-qty")?.textContent || 1);
  const product = SBH.getProducts().find(p => p.id === productId);
  if (!product) return;
  SBH.addToCart(product, qty);
  const modal = document.getElementById("product-modal");
  if (modal) { modal.remove(); document.body.style.overflow = ""; }
  showToast(`🛒 ${product.name} added to cart!`);
}

function quickAddToCart(productId) {
  const product = SBH.getProducts().find(p => p.id === productId);
  if (!product || product.status !== "instock") return;
  SBH.addToCart(product, 1);
  showToast(`🛒 ${product.name} added!`);
}

// ---- FORMAT HELPERS ----
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

// =============================================
// ADMIN LOGIN — THE IMPORTANT BIT! 🔐
// Change the password below to your own!
// =============================================
var ADMIN_PASSWORD = "SellyBakes2025!";
var adminAttempts  = parseInt(localStorage.getItem("sbh_admin_attempts") || "0");

function openAdminLogin() {
  // Check lockout
  var lockout = localStorage.getItem("sbh_lockout_until");
  if (lockout && Date.now() < parseInt(lockout)) {
    var mins = Math.ceil((parseInt(lockout) - Date.now()) / 60000);
    alert("🔒 Too many wrong attempts. Try again in " + mins + " minute(s).");
    return;
  }
  // Already logged in — go straight to admin
  if (localStorage.getItem("sbh_admin_auth") === ADMIN_PASSWORD) {
    window.location.href = "/admin/index.html";
    return;
  }
  // Show the modal
  var modal = document.getElementById("admin-login-modal");
  if (modal) {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    setTimeout(function() {
      var inp = document.getElementById("admin-password-input");
      if (inp) inp.focus();
    }, 150);
  }
}

function closeAdminLogin() {
  var modal = document.getElementById("admin-login-modal");
  if (!modal) return;
  modal.style.display = "none";
  document.body.style.overflow = "";
  var inp = document.getElementById("admin-password-input");
  var err = document.getElementById("admin-login-error");
  var btn = document.getElementById("admin-login-btn");
  if (inp) inp.value = "";
  if (err) err.style.display = "none";
  if (btn) {
    btn.textContent = "Enter Admin Panel →";
    btn.style.background = "linear-gradient(145deg,#3E1C07 0%,#5C2A10 50%,#3E1C07 100%)";
    btn.style.color = "#F0C060";
  }
}

function checkAdminPassword() {
  var inp    = document.getElementById("admin-password-input");
  var errorEl = document.getElementById("admin-login-error");
  var btn    = document.getElementById("admin-login-btn");
  if (!inp) return;
  var input = inp.value;

  if (input === ADMIN_PASSWORD) {
    // ✅ Correct password!
    localStorage.setItem("sbh_admin_auth", ADMIN_PASSWORD);
    localStorage.setItem("sbh_admin_attempts", "0");
    if (btn) {
      btn.textContent = "✅ Access Granted! Redirecting...";
      btn.style.background = "linear-gradient(135deg,#1E6B45,#2D9B65)";
      btn.style.color = "white";
    }
    setTimeout(function() {
      window.location.href = "/admin/index.html";
    }, 900);
  } else {
    // ❌ Wrong password
    adminAttempts++;
    localStorage.setItem("sbh_admin_attempts", adminAttempts.toString());
    var remaining = 5 - adminAttempts;
    if (adminAttempts >= 5) {
      localStorage.setItem("sbh_lockout_until", (Date.now() + 15*60*1000).toString());
      localStorage.setItem("sbh_admin_attempts", "0");
      adminAttempts = 0;
      if (errorEl) { errorEl.innerHTML = "🔒 Too many attempts. Locked out for 15 minutes."; errorEl.style.display = "block"; }
      setTimeout(closeAdminLogin, 2500);
    } else {
      if (errorEl) { errorEl.innerHTML = "❌ Wrong password — " + remaining + " attempt(s) left."; errorEl.style.display = "block"; }
      if (inp) { inp.value = ""; inp.focus(); }
    }
  }
}

function toggleAdminPw() {
  var inp = document.getElementById("admin-password-input");
  var btn = document.getElementById("toggle-admin-pw");
  if (!inp) return;
  if (inp.type === "password") { inp.type = "text";     if (btn) btn.textContent = "🙈"; }
  else                         { inp.type = "password"; if (btn) btn.textContent = "👁️"; }
}
