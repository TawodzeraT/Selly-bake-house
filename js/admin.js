// ================================
// SELLY BAKE HOUSE — ADMIN PANEL
// Full CMS functionality
// ================================

let currentAdminTab = "dashboard";

document.addEventListener("DOMContentLoaded", () => {
  initAdminNav();
  showTab("dashboard");
  renderDashboard();
});

// ---- NAVIGATION ----
function initAdminNav() {
  document.querySelectorAll(".admin-nav-item").forEach(item => {
    item.addEventListener("click", () => {
      const tab = item.dataset.tab;
      switchTab(tab);
    });
  });
}

function switchTab(tab) {
  currentAdminTab = tab;
  document.querySelectorAll(".admin-nav-item").forEach(item => {
    item.classList.toggle("active", item.dataset.tab === tab);
  });
  showTab(tab);
}

function showTab(tab) {
  document.querySelectorAll(".admin-tab").forEach(t => t.style.display = "none");
  const el = document.getElementById(`tab-${tab}`);
  if (el) el.style.display = "block";

  const renderers = {
    dashboard: renderDashboard,
    products:  renderProducts,
    orders:    renderOrders,
    cakes:     renderCakeRequests,
    analytics: renderAnalytics,
    settings:  renderSettings,
    gallery:   renderGallery
  };
  if (renderers[tab]) renderers[tab]();
}

// ---- DASHBOARD ----
function renderDashboard() {
  const orders   = SBH.getOrders();
  const products = SBH.getProducts();

  const totalRevenue  = orders.filter(o => o.status === "completed").reduce((s, o) => s + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const soldOutCount  = products.filter(p => p.status === "soldout").length;

  setEl("stat-revenue",  formatCurrency(totalRevenue));
  setEl("stat-orders",   orders.length.toString());
  setEl("stat-products", products.length.toString());
  setEl("stat-pending",  pendingOrders.toString());

  renderRecentOrders();
  renderBestSellers();
}

function renderRecentOrders() {
  const orders = SBH.getOrders().slice(0, 5);
  const tbody  = document.getElementById("recent-orders-tbody");
  if (!tbody) return;
  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><strong>#${o.id}</strong></td>
      <td>${o.customer}</td>
      <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${o.items}</td>
      <td><strong>${formatCurrency(o.total)}</strong></td>
      <td><span class="status-pill s-${o.status}">${o.status}</span></td>
      <td style="color:var(--text-muted)">${o.date}</td>
    </tr>
  `).join("");
}

function renderBestSellers() {
  const bs = SBH.getBestSellersByCategory(3);
  const container = document.getElementById("best-sellers-list");
  if (!container) return;
  const categories = Object.entries(bs);
  container.innerHTML = categories.map(([cat, items]) => `
    <div>
      <h4 style="font-size:.8rem;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin-bottom:.5rem">${cat}</h4>
      ${items.length === 0 ? '<p style="font-size:.82rem;color:var(--text-muted)">No data yet</p>' :
        items.map((p, i) => `
          <div style="display:flex;align-items:center;gap:.6rem;padding:.4rem 0;border-bottom:1px solid var(--cream-dark)">
            <span style="font-size:.75rem;font-weight:800;color:var(--rose-deep);min-width:16px">#${i+1}</span>
            <span style="font-size:1.1rem">${p.emoji}</span>
            <span style="font-size:.88rem;font-weight:600;color:var(--brown-dark);flex:1">${p.name}</span>
            <span style="font-size:.78rem;color:var(--text-muted)">$${p.price.toFixed(2)}</span>
          </div>
        `).join("")}
    </div>
  `).join("");
}

// ---- PRODUCTS ----
function renderProducts() {
  const products = SBH.getProducts();
  const tbody    = document.getElementById("products-tbody");
  if (!tbody) return;

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        <div class="product-row-name">
          <div class="product-row-emoji">${p.emoji}</div>
          <div>
            <div style="font-weight:700">${p.name}</div>
            <div style="font-size:.78rem;color:var(--text-muted)">${p.allergens || ""}</div>
          </div>
        </div>
      </td>
      <td>${p.category}</td>
      <td><strong>$${p.price.toFixed(2)}</strong></td>
      <td>
        <span class="status-pill s-${p.status}">${
          p.status === "instock" ? "In Stock" :
          p.status === "soldout" ? "Sold Out" : "Out of Order"
        }</span>
      </td>
      <td>${p.bestSeller ? "⭐ Yes" : "—"}</td>
      <td>${p.featured ? "✅" : "—"}</td>
      <td>
        <div style="display:flex;gap:.4rem">
          <button class="btn btn-sm btn-outline" onclick="openEditProduct(${p.id})">Edit</button>
          <button class="btn btn-sm btn-rose" onclick="cycleProductStatus(${p.id})">Status</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function cycleProductStatus(productId) {
  const products = SBH.getProducts();
  const p = products.find(p => p.id === productId);
  if (!p) return;
  const cycle = { instock: "soldout", soldout: "outoforder", outoforder: "instock" };
  p.status = cycle[p.status] || "instock";
  SBH.saveProducts(products);
  renderProducts();
  showToast(`${p.name} → ${p.status}`);
}

function openEditProduct(productId) {
  const products = SBH.getProducts();
  const p = products.find(p => p.id === productId);
  if (!p) return;

  document.getElementById("edit-product-id").value     = p.id;
  document.getElementById("edit-product-name").value   = p.name;
  document.getElementById("edit-product-price").value  = p.price;
  document.getElementById("edit-product-cat").value    = p.category;
  document.getElementById("edit-product-status").value = p.status;
  document.getElementById("edit-product-desc").value   = p.desc;
  document.getElementById("edit-product-bs").checked   = p.bestSeller;
  document.getElementById("edit-product-new").checked  = p.isNew;
  document.getElementById("edit-product-feat").checked = p.featured;

  openOverlay("edit-product-modal");
}

function saveEditProduct() {
  const id       = parseInt(document.getElementById("edit-product-id").value);
  const products = SBH.getProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return;

  products[idx] = {
    ...products[idx],
    name:       document.getElementById("edit-product-name").value.trim(),
    price:      parseFloat(document.getElementById("edit-product-price").value),
    category:   document.getElementById("edit-product-cat").value,
    status:     document.getElementById("edit-product-status").value,
    desc:       document.getElementById("edit-product-desc").value.trim(),
    bestSeller: document.getElementById("edit-product-bs").checked,
    isNew:      document.getElementById("edit-product-new").checked,
    featured:   document.getElementById("edit-product-feat").checked
  };

  SBH.saveProducts(products);
  closeOverlay("edit-product-modal");
  renderProducts();
  showToast("✅ Product updated!");
}

function openAddProductModal() {
  document.getElementById("add-product-form").reset();
  openOverlay("add-product-modal");
}

function saveNewProduct() {
  const name  = document.getElementById("new-product-name").value.trim();
  const price = parseFloat(document.getElementById("new-product-price").value);
  const cat   = document.getElementById("new-product-cat").value;
  const desc  = document.getElementById("new-product-desc").value.trim();
  const emoji = document.getElementById("new-product-emoji").value.trim() || "🎉";

  if (!name || !price || !cat || !desc) { showToast("⚠️ Please fill in all required fields."); return; }

  const products = SBH.getProducts();
  const newId    = Math.max(...products.map(p => p.id)) + 1;

  products.push({
    id: newId, name, price, category: cat, desc, emoji,
    longDesc: desc, bestSeller: false, status: "instock",
    isNew: true, featured: false, allergens: ""
  });

  SBH.saveProducts(products);
  closeOverlay("add-product-modal");
  renderProducts();
  showToast(`✅ "${name}" added to shop!`);
}

function deleteProduct(productId) {
  if (!confirm("Are you sure you want to delete this product?")) return;
  const products = SBH.getProducts().filter(p => p.id !== productId);
  SBH.saveProducts(products);
  renderProducts();
  showToast("Product deleted.");
}

// ---- ORDERS ----
function renderOrders() {
  const orders = SBH.getOrders();
  const tbody  = document.getElementById("orders-tbody");
  if (!tbody) return;

  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><strong>#${o.id}</strong></td>
      <td>
        <div style="font-weight:700">${o.customer}</div>
        <div style="font-size:.78rem;color:var(--text-muted)">${o.email}</div>
      </td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${o.items}</td>
      <td><strong>${formatCurrency(o.total)}</strong></td>
      <td>${o.method === "delivery" ? "🚗 Delivery" : "🏠 Pickup"}</td>
      <td><span class="status-pill s-${o.status}">${o.status}</span></td>
      <td style="color:var(--text-muted)">${o.date}</td>
      <td>
        <select onchange="updateOrderStatus('${o.id}', this.value)" style="font-size:.82rem;padding:.3rem .5rem;border:1px solid var(--cream-dark);border-radius:6px;font-family:Nunito">
          ${["pending","completed","cancelled"].map(s =>
            `<option value="${s}" ${o.status === s ? "selected" : ""}>${s}</option>`
          ).join("")}
        </select>
      </td>
    </tr>
  `).join("");
}

function updateOrderStatus(orderId, newStatus) {
  const orders = SBH.getOrders();
  const order  = orders.find(o => o.id === orderId);
  if (!order) return;
  order.status = newStatus;
  SBH.saveOrders(orders);
  showToast(`Order #${orderId} → ${newStatus}`);
}

// ---- CAKE REQUESTS ----
function renderCakeRequests() {
  const requests = SBH.getCakeRequests();
  const tbody    = document.getElementById("cakes-tbody");
  if (!tbody) return;

  tbody.innerHTML = requests.map(r => `
    <tr>
      <td><strong>${r.id}</strong></td>
      <td>
        <div style="font-weight:700">${r.name}</div>
        <div style="font-size:.78rem;color:var(--text-muted)">${r.email}</div>
      </td>
      <td>${r.date}</td>
      <td>${r.flavor}, ${r.size}</td>
      <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.design}</td>
      <td><span class="status-pill s-${r.status}">${r.status}</span></td>
      <td>
        <div style="display:flex;gap:.3rem;flex-wrap:wrap">
          <button class="btn btn-sm btn-primary"  onclick="updateCakeStatus('${r.id}', 'approved')">Approve</button>
          <button class="btn btn-sm btn-outline"   onclick="updateCakeStatus('${r.id}', 'rejected')">Reject</button>
          <button class="btn btn-sm btn-rose"      onclick="viewCakeRequest('${r.id}')">View</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function updateCakeStatus(reqId, status) {
  const requests = SBH.getCakeRequests();
  const req = requests.find(r => r.id === reqId);
  if (!req) return;
  req.status = status;
  try { localStorage.setItem("sbh_cake_requests", JSON.stringify(requests)); } catch {}
  renderCakeRequests();
  showToast(`Request ${reqId} → ${status}`);
}

function viewCakeRequest(reqId) {
  const req = SBH.getCakeRequests().find(r => r.id === reqId);
  if (!req) return;

  const rows = [
    ["Customer",    req.name],
    ["Email",       req.email],
    ["Phone",       req.phone],
    ["Date Needed", req.date],
    ["Size",        req.size],
    ["Flavor",      req.flavor],
    ["Frosting",    req.frosting],
    ["Filling",     req.filling],
    ["Add-ons",     req.addons?.join(", ") || "None"],
    ["Design",      req.design],
    ["Method",      req.method === "pickup" ? "Pickup" : "Delivery"],
    ["Notes",       req.notes || "—"],
    ["Status",      req.status],
    ["Submitted",   req.submitted]
  ];

  const detailEl = document.getElementById("cake-request-detail");
  if (detailEl) {
    detailEl.innerHTML = `
      <h3 class="serif" style="font-size:1.4rem;color:var(--brown-dark);margin-bottom:1rem">Cake Request ${req.id}</h3>
      <table class="review-table">
        ${rows.map(([l, v]) => `<tr><td>${l}</td><td>${v}</td></tr>`).join("")}
      </table>
    `;
  }
  openOverlay("cake-detail-modal");
}

// ---- ANALYTICS ----
function renderAnalytics() {
  const orders   = SBH.getOrders();
  const products = SBH.getProducts();

  // Simple bar chart
  const weeklyData = [320, 480, 390, 510, 430, 670, 295];
  const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const maxVal     = Math.max(...weeklyData);

  const chartEl = document.getElementById("weekly-chart");
  if (chartEl) {
    chartEl.innerHTML = `
      <div class="chart-bars">
        ${weeklyData.map((v, i) => `
          <div class="chart-bar" style="height:${Math.round((v / maxVal) * 110)}px">
            <span>$${v}</span>
          </div>
        `).join("")}
      </div>
      <div class="chart-labels">
        ${weekLabels.map(l => `<span>${l}</span>`).join("")}
      </div>
    `;
  }

  // Category breakdown
  const catBreakdown = document.getElementById("category-breakdown");
  if (catBreakdown) {
    const cats = SBH.categories;
    catBreakdown.innerHTML = cats.map(cat => {
      const count = products.filter(p => p.category === cat.id).length;
      const pct   = Math.round((count / products.length) * 100);
      return `
        <div style="margin-bottom:.8rem">
          <div style="display:flex;justify-content:space-between;font-size:.88rem;margin-bottom:.3rem">
            <span style="font-weight:700;color:var(--brown-dark)">${cat.emoji} ${cat.label}</span>
            <span style="color:var(--text-muted)">${count} products (${pct}%)</span>
          </div>
          <div style="height:8px;background:var(--cream-dark);border-radius:50px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:var(--rose-deep);border-radius:50px;transition:width .5s"></div>
          </div>
        </div>
      `;
    }).join("");
  }
}

// ---- SETTINGS ----
function renderSettings() {
  const settings = SBH.getSettings();

  // Toggles
  setToggle("toggle-cakes",  settings.cakesEnabled);
  setToggle("toggle-emails", settings.emailsEnabled);

  // Fields
  setValue2("settings-delivery-radius", settings.deliveryRadius);
  setValue2("settings-delivery-fee",    settings.deliveryFee);

  // Save handlers
  const saveBtn = document.getElementById("save-settings-btn");
  if (saveBtn) {
    saveBtn.onclick = saveSettings;
  }

  // Preview email
  renderEmailPreview();
}

function setToggle(id, isOn) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle("on", isOn);
  el.dataset.on = isOn ? "1" : "0";
  el.onclick = () => {
    const current = el.dataset.on === "1";
    el.classList.toggle("on", !current);
    el.dataset.on = !current ? "1" : "0";
  };
}

function setValue2(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

function getValue2(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}

function saveSettings() {
  const cakesEl  = document.getElementById("toggle-cakes");
  const emailsEl = document.getElementById("toggle-emails");

  const settings = {
    cakesEnabled:   cakesEl  ? cakesEl.dataset.on  === "1" : true,
    emailsEnabled:  emailsEl ? emailsEl.dataset.on === "1" : true,
    deliveryRadius: getValue2("settings-delivery-radius"),
    deliveryFee:    getValue2("settings-delivery-fee")
  };

  SBH.saveSettings(settings);
  showToast("✅ Settings saved!");
}

function renderEmailPreview() {
  const bs   = SBH.getBestSellersByCategory(3);
  const prods = SBH.getProducts();
  const newProds = prods.filter(p => p.isNew).slice(0, 3);

  const container = document.getElementById("email-preview-content");
  if (!container) return;

  container.innerHTML = `
    <div class="ep-subject">📧 Weekly Digest — Selly Bake House | Week of ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}</div>
    <div class="ep-section"><span class="ep-label">✨ New Arrivals:</span> ${newProds.map(p => p.name).join(", ") || "No new items this week"}</div>
    <div class="ep-section"><span class="ep-label">⭐ Best Sellers — Cookies:</span> ${bs.Cookies.map(p => p.name).join(", ") || "—"}</div>
    <div class="ep-section"><span class="ep-label">⭐ Best Sellers — Cakes:</span> ${bs.Cakes.map(p => p.name).join(", ") || "—"}</div>
    <div class="ep-section"><span class="ep-label">⭐ Best Sellers — Bakery:</span> ${bs.Bakery.map(p => p.name).join(", ") || "—"}</div>
    <div class="ep-section">🎂 Custom cake orders are ${SBH.getSettings().cakesEnabled ? "OPEN" : "currently paused"}. Book your date early!</div>
    <div class="ep-section" style="margin-top:.6rem;font-size:.82rem;color:var(--text-muted)">📍 721 Fallsgrove Dr, Rockville MD | ☎ (301) 356-1232</div>
  `;
}

function sendTestEmail() {
  showToast("📧 Test email sent to sellybakehouse@gmail.com");
}

// ---- GALLERY ----
function renderGallery() {
  // Gallery management would show uploaded images
  // For now, shows placeholder
}

// ---- HELPERS ----
function setEl(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
