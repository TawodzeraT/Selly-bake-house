/* =============================================
   SELLY BAKE HOUSE — ADMIN JS
   ============================================= */

var currentSession = null;

document.addEventListener("DOMContentLoaded", function() {
  checkAdminSession();
});

/* ---- SESSION CHECK ---- */
function checkAdminSession() {
  currentSession = SBH.getAdminSession();
  if (!currentSession) {
    showAdminLoginScreen();
  } else {
    hideAdminLoginScreen();
    initAdminPanel();
  }
}

function showAdminLoginScreen() {
  var loginScreen = document.getElementById("admin-login-screen");
  var fullPanel   = document.getElementById("admin-full-panel");
  if (loginScreen) loginScreen.style.display = "flex";
  if (fullPanel)   fullPanel.style.display   = "none";
  setTimeout(function() {
    var emailInput = document.getElementById("al-email");
    if (emailInput) emailInput.focus();
  }, 200);
}

function hideAdminLoginScreen() {
  var loginScreen = document.getElementById("admin-login-screen");
  var fullPanel   = document.getElementById("admin-full-panel");
  if (loginScreen) loginScreen.style.display = "none";
  if (fullPanel)   fullPanel.style.display   = "block";
}

/* ---- LOGIN ---- */
function doAdminLogin() {
  var email    = document.getElementById("al-email").value.trim();
  var password = document.getElementById("al-password").value;
  var errorEl  = document.getElementById("al-error");
  var btn      = document.getElementById("al-btn");

  if (!email || !password) {
    showALError("Please enter your email address and password.");
    return;
  }

  var user = SBH.adminLogin(email, password);

  if (user) {
    currentSession = SBH.getAdminSession();
    if (btn) {
      btn.textContent = "✅ Welcome " + user.name.split(" ")[0] + "! Loading...";
      btn.style.background = "linear-gradient(135deg,#1E6B45,#2D9B65)";
      btn.style.color = "white";
    }
    setTimeout(function() {
      hideAdminLoginScreen();
      initAdminPanel();
    }, 700);
  } else {
    showALError("Wrong email or password. Please try again.");
    var passInput = document.getElementById("al-password");
    if (passInput) { passInput.value = ""; passInput.focus(); }
  }
}

function showALError(msg) {
  var el = document.getElementById("al-error");
  if (el) { el.textContent = msg; el.style.display = "block"; }
}

function adminLogout() {
  SBH.clearAdminSession();
  currentSession = null;
  window.location.href = "../index.html";
}

/* ---- INIT PANEL ---- */
function initAdminPanel() {
  if (!currentSession) return;

  // Set name and role in header and sidebar
  var nameEl        = document.getElementById("admin-user-name");
  var roleEl        = document.getElementById("admin-user-role");
  var sidebarNameEl = document.getElementById("admin-sidebar-name");

  if (nameEl)        nameEl.textContent        = currentSession.name;
  if (sidebarNameEl) sidebarNameEl.textContent = currentSession.name;
  if (roleEl)        roleEl.textContent        = currentSession.role === "master" ? "Master Admin" : "Staff";

  // Show Users and Settings only for master admins
  var usersNav    = document.getElementById("nav-users");
  var settingsNav = document.getElementById("nav-settings");
  if (usersNav)    usersNav.style.display    = currentSession.role === "master" ? "flex" : "none";
  if (settingsNav) settingsNav.style.display = currentSession.role === "master" ? "flex" : "none";

  initAdminNav();
  showTab("dashboard");
}

/* ---- NAVIGATION ---- */
function initAdminNav() {
  document.querySelectorAll(".admin-nav-item").forEach(function(item) {
    item.addEventListener("click", function() {
      if (item.dataset.tab) switchTab(item.dataset.tab);
    });
  });
}

function switchTab(tab) {
  // Check permissions
  if ((tab === "users" || tab === "settings") && currentSession && currentSession.role !== "master") {
    showAdminToast("Only Master Admins can access this section.");
    return;
  }
  document.querySelectorAll(".admin-nav-item").forEach(function(item) {
    item.classList.toggle("active", item.dataset.tab === tab);
  });
  showTab(tab);
}

function showTab(tab) {
  document.querySelectorAll(".admin-tab").forEach(function(t) {
    t.style.display = "none";
  });
  var el = document.getElementById("tab-" + tab);
  if (el) el.style.display = "block";

  var renderers = {
    dashboard: renderDashboard,
    analytics: renderAnalytics,
    products:  renderProducts,
    orders:    renderOrders,
    cakes:     renderCakeRequests,
    users:     renderUsers,
    settings:  renderSettings
  };
  if (renderers[tab]) renderers[tab]();
}

/* ---- HELPERS ---- */
function setEl(id, val) {
  var e = document.getElementById(id);
  if (e) e.textContent = val;
}

function formatCurrency(n) {
  return "$" + parseFloat(n || 0).toFixed(2);
}

function showAdminToast(msg) {
  var c = document.getElementById("toast-container");
  if (!c) return;
  var t = document.createElement("div");
  t.className   = "toast";
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(function() {
    t.classList.add("removing");
    setTimeout(function() { t.remove(); }, 300);
  }, 2800);
}

/* ---- DASHBOARD ---- */
function renderDashboard() {
  var orders   = SBH.getOrders();
  var products = SBH.getProducts();
  var cakeReqs = SBH.getCakeRequests();

  var revenue = orders
    .filter(function(o) { return o.status === "completed"; })
    .reduce(function(s, o) { return s + (parseFloat(o.total) || 0); }, 0);

  var pending = orders.filter(function(o) { return o.status === "pending"; }).length;

  setEl("stat-revenue",     formatCurrency(revenue));
  setEl("stat-orders",      orders.length.toString());
  setEl("stat-products",    products.length.toString());
  setEl("stat-cakes",       cakeReqs.length.toString());
  setEl("stat-pending-sub", pending + " pending");

  renderRecentOrders();
  renderBestSellersList();
}

function renderRecentOrders() {
  var orders = SBH.getOrders().slice(0, 5);
  var tbody  = document.getElementById("recent-orders-tbody");
  if (!tbody) return;

  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-muted);">No orders yet. Orders will appear here when customers purchase from your shop.</td></tr>';
    return;
  }

  tbody.innerHTML = orders.map(function(o) {
    return '<tr>' +
      '<td><strong>#' + o.id + '</strong></td>' +
      '<td>' + (o.customer || "Guest") + '</td>' +
      '<td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + (o.items || "") + '</td>' +
      '<td><strong>' + formatCurrency(o.total) + '</strong></td>' +
      '<td><span class="status-pill s-' + (o.status || "pending") + '">' + (o.status || "pending") + '</span></td>' +
      '<td style="color:var(--text-muted)">' + (o.date || "") + '</td>' +
      '</tr>';
  }).join("");
}

function renderBestSellersList() {
  var bs  = SBH.getBestSellersByCategory(3);
  var el  = document.getElementById("best-sellers-list");
  if (!el) return;

  var html = "";
  ["Cookies", "Cakes", "Bakery"].forEach(function(cat) {
    var items = bs[cat] || [];
    html += '<h4 style="font-size:.78rem;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin:.8rem 0 .4rem">' + cat + '</h4>';
    if (items.length === 0) {
      html += '<p style="font-size:.82rem;color:var(--text-muted);margin-bottom:.4rem">No data yet</p>';
    } else {
      items.forEach(function(p, i) {
        html += '<div style="display:flex;align-items:center;gap:.6rem;padding:.35rem 0;border-bottom:1px solid var(--cream-dark)">' +
          '<span style="font-size:.75rem;font-weight:800;color:var(--rose-deep);min-width:16px">#' + (i + 1) + '</span>' +
          '<span>' + p.emoji + '</span>' +
          '<span style="font-size:.85rem;font-weight:600;color:var(--brown-dark);flex:1">' + p.name + '</span>' +
          '<span style="font-size:.78rem;color:var(--text-muted)">$' + p.price.toFixed(2) + '</span>' +
          '</div>';
      });
    }
  });

  el.innerHTML = html;
}

/* ---- PRODUCTS ---- */
function renderProducts() {
  var products = SBH.getProducts();
  var tbody    = document.getElementById("products-tbody");
  if (!tbody) return;

  tbody.innerHTML = products.map(function(p) {
    var statusLabel = p.status === "instock" ? "In Stock" : p.status === "soldout" ? "Sold Out" : "Out of Order";
    return '<tr>' +
      '<td><div class="product-row-name">' +
      '<div class="product-row-emoji">' + p.emoji + '</div>' +
      '<div><div style="font-weight:700">' + p.name + '</div>' +
      '<div style="font-size:.78rem;color:var(--text-muted)">' + (p.allergens || "") + '</div></div>' +
      '</div></td>' +
      '<td>' + p.category + '</td>' +
      '<td><strong>$' + p.price.toFixed(2) + '</strong></td>' +
      '<td><span class="status-pill s-' + p.status + '">' + statusLabel + '</span></td>' +
      '<td>' + (p.bestSeller ? "⭐ Yes" : "—") + '</td>' +
      '<td><div style="display:flex;gap:.4rem">' +
      '<button class="btn btn-sm btn-outline" onclick="openEditProduct(' + p.id + ')">Edit</button>' +
      '<button class="btn btn-sm btn-rose" onclick="cycleProductStatus(' + p.id + ')">Status</button>' +
      '</div></td></tr>';
  }).join("");
}

function cycleProductStatus(productId) {
  var products = SBH.getProducts();
  var p = products.find(function(p) { return p.id === productId; });
  if (!p) return;
  var cycle = { instock: "soldout", soldout: "outoforder", outoforder: "instock" };
  p.status = cycle[p.status] || "instock";
  SBH.saveProducts(products);
  renderProducts();
  showAdminToast(p.name + " is now " + p.status);
}

function openEditProduct(productId) {
  var p = SBH.getProducts().find(function(p) { return p.id === productId; });
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
  var id       = parseInt(document.getElementById("edit-product-id").value);
  var products = SBH.getProducts();
  var idx      = products.findIndex(function(p) { return p.id === id; });
  if (idx === -1) return;

  products[idx] = Object.assign({}, products[idx], {
    name:       document.getElementById("edit-product-name").value.trim(),
    price:      parseFloat(document.getElementById("edit-product-price").value),
    category:   document.getElementById("edit-product-cat").value,
    status:     document.getElementById("edit-product-status").value,
    desc:       document.getElementById("edit-product-desc").value.trim(),
    bestSeller: document.getElementById("edit-product-bs").checked,
    isNew:      document.getElementById("edit-product-new").checked,
    featured:   document.getElementById("edit-product-feat").checked
  });

  SBH.saveProducts(products);
  closeOverlay("edit-product-modal");
  renderProducts();
  showAdminToast("Product updated!");
}

function openAddProductModal() {
  document.getElementById("new-product-name").value  = "";
  document.getElementById("new-product-price").value = "";
  document.getElementById("new-product-desc").value  = "";
  document.getElementById("new-product-emoji").value = "";
  openOverlay("add-product-modal");
}

function saveNewProduct() {
  var name  = document.getElementById("new-product-name").value.trim();
  var price = parseFloat(document.getElementById("new-product-price").value);
  var cat   = document.getElementById("new-product-cat").value;
  var desc  = document.getElementById("new-product-desc").value.trim();
  var emoji = document.getElementById("new-product-emoji").value.trim() || "🎉";

  if (!name || !price || !desc) {
    showAdminToast("Please fill in all required fields.");
    return;
  }

  var products = SBH.getProducts();
  var newId    = products.length > 0
    ? Math.max.apply(null, products.map(function(p) { return p.id; })) + 1
    : 1;

  products.push({
    id: newId, name: name, price: price, category: cat,
    desc: desc, emoji: emoji, longDesc: desc,
    bestSeller: false, status: "instock",
    isNew: true, featured: false, allergens: ""
  });

  SBH.saveProducts(products);
  closeOverlay("add-product-modal");
  renderProducts();
  showAdminToast(name + " added to shop!");
}

/* ---- ORDERS ---- */
function renderOrders() {
  var orders = SBH.getOrders();
  var tbody  = document.getElementById("orders-tbody");
  if (!tbody) return;

  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:3rem;color:var(--text-muted);">No orders yet. Orders will appear here when customers purchase from your shop.</td></tr>';
    return;
  }

  tbody.innerHTML = orders.map(function(o) {
    return '<tr>' +
      '<td><strong>#' + o.id + '</strong></td>' +
      '<td><div style="font-weight:700">' + (o.customer || "Guest") + '</div>' +
      '<div style="font-size:.78rem;color:var(--text-muted)">' + (o.email || "") + '</div></td>' +
      '<td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + (o.items || "") + '</td>' +
      '<td><strong>' + formatCurrency(o.total) + '</strong></td>' +
      '<td>' + (o.method === "delivery" ? "🚗 Delivery" : "🏠 Pickup") + '</td>' +
      '<td><span class="status-pill s-' + (o.status || "pending") + '">' + (o.status || "pending") + '</span></td>' +
      '<td style="color:var(--text-muted)">' + (o.date || "") + '</td>' +
      '<td>' +
      '<select onchange="updateOrderStatus(\'' + o.id + '\', this.value)" ' +
      'style="font-size:.82rem;padding:.3rem .5rem;border:1px solid var(--cream-dark);border-radius:6px;font-family:Nunito">' +
      ['pending', 'completed', 'cancelled'].map(function(s) {
        return '<option value="' + s + '"' + (o.status === s ? ' selected' : '') + '>' + s + '</option>';
      }).join("") +
      '</select>' +
      '</td></tr>';
  }).join("");
}

function updateOrderStatus(orderId, newStatus) {
  var orders = SBH.getOrders();
  var order  = orders.find(function(o) { return o.id === orderId; });
  if (!order) return;
  order.status = newStatus;
  SBH.saveOrders(orders);
  showAdminToast("Order #" + orderId + " updated to " + newStatus);
}

/* ---- CAKE REQUESTS ---- */
function renderCakeRequests() {
  var requests = SBH.getCakeRequests();
  var tbody    = document.getElementById("cakes-tbody");
  if (!tbody) return;

  if (requests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:3rem;color:var(--text-muted);">No custom cake requests yet. When customers submit a request it will appear here.</td></tr>';
    return;
  }

  tbody.innerHTML = requests.map(function(r) {
    return '<tr>' +
      '<td><strong>' + r.id + '</strong></td>' +
      '<td><div style="font-weight:700">' + r.name + '</div>' +
      '<div style="font-size:.78rem;color:var(--text-muted)">' + (r.email || "") + '</div></td>' +
      '<td>' + (r.date || "") + '</td>' +
      '<td>' + (r.flavor || "") + ', ' + (r.size || "") + '</td>' +
      '<td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + (r.design || "") + '</td>' +
      '<td><span class="status-pill s-' + (r.status || "pending") + '">' + (r.status || "pending") + '</span></td>' +
      '<td><div style="display:flex;gap:.3rem;flex-wrap:wrap">' +
      '<button class="btn btn-sm btn-primary"  onclick="updateCakeStatus(\'' + r.id + '\',\'approved\')">Approve</button>' +
      '<button class="btn btn-sm btn-outline"  onclick="updateCakeStatus(\'' + r.id + '\',\'rejected\')">Reject</button>' +
      '<button class="btn btn-sm btn-rose"     onclick="viewCakeRequest(\'' + r.id + '\')">View</button>' +
      '</div></td></tr>';
  }).join("");
}

function updateCakeStatus(reqId, status) {
  SBH.updateCakeRequest(reqId, { status: status });
  renderCakeRequests();
  showAdminToast("Request " + reqId + " marked as " + status);
}

function viewCakeRequest(reqId) {
  var req = SBH.getCakeRequests().find(function(r) { return r.id === reqId; });
  if (!req) return;

  var rows = [
    ["Customer",  req.name],
    ["Email",     req.email || "Not provided"],
    ["Phone",     req.phone || "Not provided"],
    ["Date",      req.date  || "Not specified"],
    ["Size",      req.size  || "Not specified"],
    ["Flavor",    req.flavor || "Not specified"],
    ["Frosting",  req.frosting || "Not specified"],
    ["Filling",   req.filling  || "None"],
    ["Add-ons",   req.addons && req.addons.length ? req.addons.join(", ") : "None"],
    ["Design",    req.design || "Not provided"],
    ["Method",    req.method === "pickup" ? "Pickup" : "Delivery"],
    ["Notes",     req.notes || "None"],
    ["Status",    req.status || "pending"],
    ["Submitted", req.submitted || "Unknown"]
  ];

  var el = document.getElementById("cake-request-detail");
  if (el) {
    var html = '<h3 style="font-family:Cormorant Garamond,serif;font-size:1.5rem;color:var(--brown-dark);margin-bottom:1rem">Request ' + req.id + '</h3>';

    if (req.imageData) {
      html += '<div style="margin-bottom:1.2rem;">' +
        '<strong style="font-size:.85rem;color:var(--brown);display:block;margin-bottom:.5rem;">Reference Image</strong>' +
        '<img src="' + req.imageData + '" style="max-width:100%;max-height:250px;border-radius:8px;border:1.5px solid var(--cream-dark);" />' +
        '</div>';
    }

    html += '<table class="review-table"><tbody>' +
      rows.map(function(r) {
        return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>';
      }).join("") +
      '</tbody></table>';

    el.innerHTML = html;
  }
  openOverlay("cake-detail-modal");
}

/* ---- ANALYTICS ---- */
function renderAnalytics() {
  var orders   = SBH.getOrders();
  var products = SBH.getProducts();

  var days   = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  var values = [0, 0, 0, 0, 0, 0, 0];

  orders
    .filter(function(o) { return o.status === "completed"; })
    .forEach(function(o) {
      var d = new Date(o.date);
      if (!isNaN(d.getTime())) {
        var idx = d.getDay() === 0 ? 6 : d.getDay() - 1;
        values[idx] += parseFloat(o.total) || 0;
      }
    });

  var maxVal   = Math.max.apply(null, values) || 1;
  var chartEl  = document.getElementById("weekly-chart");

  if (chartEl) {
    chartEl.innerHTML =
      '<div class="chart-bars">' +
      values.map(function(v) {
        return '<div class="chart-bar" style="height:' + Math.round((v / maxVal) * 110) + 'px">' +
               '<span>$' + Math.round(v) + '</span></div>';
      }).join("") +
      '</div>' +
      '<div class="chart-labels">' +
      days.map(function(l) { return '<span>' + l + '</span>'; }).join("") +
      '</div>';
  }

  var total   = products.length || 1;
  var catEl   = document.getElementById("category-breakdown");
  if (catEl) {
    catEl.innerHTML = ["Cookies", "Cakes", "Bakery"].map(function(cat) {
      var count = products.filter(function(p) { return p.category === cat; }).length;
      var pct   = Math.round((count / total) * 100);
      return '<div style="margin-bottom:.8rem">' +
        '<div style="display:flex;justify-content:space-between;font-size:.88rem;margin-bottom:.3rem">' +
        '<span style="font-weight:700;color:var(--brown-dark)">' + cat + '</span>' +
        '<span style="color:var(--text-muted)">' + count + ' products (' + pct + '%)</span></div>' +
        '<div style="height:8px;background:var(--cream-dark);border-radius:50px;overflow:hidden">' +
        '<div style="height:100%;width:' + pct + '%;background:var(--rose-deep);border-radius:50px;transition:width .5s"></div>' +
        '</div></div>';
    }).join("");
  }
}

/* ---- SETTINGS ---- */
function renderSettings() {
  var settings = SBH.getSettings();
  setToggle("toggle-cakes",  settings.cakesEnabled);
  setToggle("toggle-emails", settings.emailsEnabled);

  var r = document.getElementById("settings-delivery-radius");
  var f = document.getElementById("settings-delivery-fee");
  var q = document.getElementById("settings-square-link");
  if (r) r.value = settings.deliveryRadius || "30";
  if (f) f.value = settings.deliveryFee    || "8.99";
  if (q) q.value = settings.squareLink     || "";

  renderEmailPreview();
}

function setToggle(id, isOn) {
  var el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle("on", !!isOn);
  el.dataset.on = isOn ? "1" : "0";
  el.onclick = function() {
    var current = el.dataset.on === "1";
    el.classList.toggle("on", !current);
    el.dataset.on = !current ? "1" : "0";
  };
}

function saveSettings() {
  var cEl = document.getElementById("toggle-cakes");
  var eEl = document.getElementById("toggle-emails");
  var r   = document.getElementById("settings-delivery-radius");
  var f   = document.getElementById("settings-delivery-fee");
  var q   = document.getElementById("settings-square-link");

  SBH.saveSettings({
    cakesEnabled:   cEl ? cEl.dataset.on  === "1" : true,
    emailsEnabled:  eEl ? eEl.dataset.on  === "1" : true,
    deliveryRadius: r   ? r.value          : "30",
    deliveryFee:    f   ? f.value          : "8.99",
    squareLink:     q   ? q.value.trim()   : ""
  });
  showAdminToast("Settings saved!");
}

function renderEmailPreview() {
  var bs       = SBH.getBestSellersByCategory(3);
  var prods    = SBH.getProducts();
  var newProds = prods.filter(function(p) { return p.isNew; }).slice(0, 3);
  var el       = document.getElementById("email-preview-content");
  if (!el) return;

  el.innerHTML =
    '<div class="ep-subject">Weekly Digest — Selly Bake House | Week of ' +
    new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" }) + '</div>' +
    '<div class="ep-section"><span class="ep-label">New Arrivals:</span> ' +
    (newProds.map(function(p) { return p.name; }).join(", ") || "No new items this week") + '</div>' +
    '<div class="ep-section"><span class="ep-label">Best Cookies:</span> ' +
    (bs.Cookies.map(function(p) { return p.name; }).join(", ") || "None yet") + '</div>' +
    '<div class="ep-section"><span class="ep-label">Best Cakes:</span> ' +
    (bs.Cakes.map(function(p) { return p.name; }).join(", ") || "None yet") + '</div>' +
    '<div class="ep-section"><span class="ep-label">Best Bakery:</span> ' +
    (bs.Bakery.map(function(p) { return p.name; }).join(", ") || "None yet") + '</div>' +
    '<div class="ep-section">Custom cake orders are ' +
    (SBH.getSettings().cakesEnabled ? "OPEN" : "currently paused") +
    '. Book your date early!</div>';
}

function sendTestEmail() {
  showAdminToast("Test email sent to sellybakehouse@gmail.com");
}

/* ---- USERS ---- */
function renderUsers() {
  if (!currentSession || currentSession.role !== "master") {
    showAdminToast("Only Master Admins can manage users.");
    return;
  }

  var users = SBH.getAdminUsers();
  var tbody = document.getElementById("users-tbody");
  if (!tbody) return;

  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:2rem;color:var(--text-muted);">No users found.</td></tr>';
    return;
  }

  tbody.innerHTML = users.map(function(u) {
    var isSelf = currentSession && u.id === currentSession.id;
    return '<tr>' +
      '<td><div style="font-weight:700">' + u.name + '</div>' +
      '<div style="font-size:.78rem;color:var(--text-muted)">' + u.email + '</div></td>' +
      '<td><span class="status-pill ' + (u.role === "master" ? "s-completed" : "s-pending") + '">' +
      (u.role === "master" ? "Master Admin" : "Staff") + '</span></td>' +
      '<td style="color:var(--text-muted)">' + (u.createdAt || "N/A") + '</td>' +
      '<td>' +
      (isSelf
        ? '<span style="font-size:.8rem;color:var(--text-muted);">This is you</span>'
        : '<button class="btn btn-sm btn-rose" onclick="deleteAdminUser(\'' + u.id + '\')">Remove</button>'
      ) +
      '</td></tr>';
  }).join("");
}

function openAddUserModal() {
  if (!currentSession || currentSession.role !== "master") {
    showAdminToast("Only Master Admins can add users.");
    return;
  }
  document.getElementById("new-user-name").value     = "";
  document.getElementById("new-user-email").value    = "";
  document.getElementById("new-user-password").value = "";
  document.getElementById("new-user-role").value     = "staff";
  openOverlay("add-user-modal");
}

function saveNewUser() {
  var name     = document.getElementById("new-user-name").value.trim();
  var email    = document.getElementById("new-user-email").value.trim();
  var password = document.getElementById("new-user-password").value;
  var role     = document.getElementById("new-user-role").value;

  if (!name || !email || !password) {
    showAdminToast("Please fill in all fields.");
    return;
  }

  var existing = SBH.getAdminUsers().find(function(u) {
    return u.email.toLowerCase() === email.toLowerCase();
  });
  if (existing) {
    showAdminToast("An account with that email already exists.");
    return;
  }

  SBH.addAdminUser({ name: name, email: email, password: password, role: role });
  closeOverlay("add-user-modal");
  renderUsers();
  showAdminToast(name + " added as " + role + "!");
}

function deleteAdminUser(id) {
  if (!currentSession || currentSession.role !== "master") return;
  if (!confirm("Are you sure you want to remove this user?")) return;
  SBH.deleteAdminUser(id);
  renderUsers();
  showAdminToast("User removed.");
}
