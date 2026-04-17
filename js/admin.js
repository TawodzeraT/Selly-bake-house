// ================================================================
// SELLY BAKE HOUSE — ADMIN JS (COMPLETE)
// ================================================================

var currentSession = null;

document.addEventListener("DOMContentLoaded", function() { checkAdminSession(); });

function checkAdminSession() {
  currentSession = SBH.getAdminSession();
  if (!currentSession) { showAdminLoginScreen(); } else { hideAdminLoginScreen(); initAdminPanel(); }
}
function showAdminLoginScreen() {
  var ls = document.getElementById("admin-login-screen"); var fp = document.getElementById("admin-full-panel");
  if (ls) ls.style.display = "flex"; if (fp) fp.style.display = "none";
  setTimeout(function() { var e = document.getElementById("al-email"); if (e) e.focus(); }, 200);
}
function hideAdminLoginScreen() {
  var ls = document.getElementById("admin-login-screen"); var fp = document.getElementById("admin-full-panel");
  if (ls) ls.style.display = "none"; if (fp) fp.style.display = "block";
}
function doAdminLogin() {
  var email = document.getElementById("al-email").value.trim();
  var pass  = document.getElementById("al-password").value;
  var btn   = document.getElementById("al-btn");
  if (!email || !pass) { showALError("Please enter your email and password."); return; }
  var user = SBH.adminLogin(email, pass);
  if (user) {
    currentSession = SBH.getAdminSession();
    if (btn) { btn.textContent = "✅ Welcome " + user.name.split(" ")[0] + "!"; btn.style.background = "linear-gradient(135deg,#1E6B45,#2D9B65)"; btn.style.color = "white"; }
    setTimeout(function() { hideAdminLoginScreen(); initAdminPanel(); }, 700);
  } else { showALError("Wrong email or password. Please try again."); var pi = document.getElementById("al-password"); if (pi) { pi.value = ""; pi.focus(); } }
}
function showALError(msg) { var el = document.getElementById("al-error"); if (el) { el.textContent = msg; el.style.display = "block"; } }
function adminLogout() { SBH.clearAdminSession(); currentSession = null; window.location.href = "../index.html"; }

function initAdminPanel() {
  if (!currentSession) return;
  var nameEl    = document.getElementById("admin-user-name");
  var roleEl    = document.getElementById("admin-user-role");
  var sbarName  = document.getElementById("admin-sidebar-name");
  if (nameEl)   nameEl.textContent   = currentSession.name;
  if (sbarName) sbarName.textContent = currentSession.name;
  if (roleEl)   roleEl.textContent   = currentSession.role === "master" ? "Master Admin" : "Staff";
  var usersNav    = document.getElementById("nav-users");
  var settingsNav = document.getElementById("nav-settings");
  if (usersNav)    usersNav.style.display    = currentSession.role === "master" ? "flex" : "none";
  if (settingsNav) settingsNav.style.display = currentSession.role === "master" ? "flex" : "none";
  initAdminNav();
  showTab("dashboard");
}

function initAdminNav() {
  document.querySelectorAll(".admin-nav-item").forEach(function(item) {
    item.addEventListener("click", function() { if (item.dataset.tab) switchTab(item.dataset.tab); });
  });
}
function switchTab(tab) {
  if ((tab === "users" || tab === "settings") && currentSession && currentSession.role !== "master") {
    showAdminToast("Only Master Admins can access this section."); return;
  }
  document.querySelectorAll(".admin-nav-item").forEach(function(item) { item.classList.toggle("active", item.dataset.tab === tab); });
  showTab(tab);
}
function showTab(tab) {
  document.querySelectorAll(".admin-tab").forEach(function(t) { t.style.display = "none"; });
  var el = document.getElementById("tab-" + tab);
  if (el) el.style.display = "block";
  var renderers = { dashboard:renderDashboard, analytics:renderAnalytics, products:renderProducts, orders:renderOrders, cakes:renderCakeRequests, users:renderUsers, settings:renderSettings, blocked:renderBlockedDates, feedback:renderFeedback };
  if (renderers[tab]) renderers[tab]();
}

function setEl(id, val) { var e = document.getElementById(id); if (e) e.textContent = val; }
function formatCurrency(n) { return "$" + parseFloat(n || 0).toFixed(2); }
function showAdminToast(msg) {
  var c = document.getElementById("toast-container"); if (!c) return;
  var t = document.createElement("div"); t.className = "toast"; t.textContent = msg; c.appendChild(t);
  setTimeout(function() { t.classList.add("removing"); setTimeout(function() { t.remove(); }, 300); }, 2800);
}

// ── DASHBOARD ────────────────────────────────────────────────────
function renderDashboard() {
  var orders   = SBH.getOrders(); var products = SBH.getProducts(); var cakeReqs = SBH.getCakeRequests();
  var revenue  = orders.filter(function(o) { return o.status === "completed"; }).reduce(function(s,o) { return s + (parseFloat(o.total)||0); }, 0);
  var pending  = orders.filter(function(o) { return o.status === "pending"; }).length;
  setEl("stat-revenue", formatCurrency(revenue)); setEl("stat-orders", orders.length.toString());
  setEl("stat-products", products.length.toString()); setEl("stat-cakes", cakeReqs.length.toString());
  setEl("stat-pending-sub", pending + " pending");
  renderRecentOrders(); renderBestSellersList();
}

function renderRecentOrders() {
  var orders = SBH.getOrders().slice(0,5); var tbody = document.getElementById("recent-orders-tbody"); if (!tbody) return;
  if (orders.length === 0) { tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-muted);">No orders yet.</td></tr>'; return; }
  tbody.innerHTML = orders.map(function(o) {
    return '<tr><td><strong>#' + o.id + '</strong></td><td>' + (o.customer||"Guest") + '</td>' +
    '<td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + (o.items||"") + '</td>' +
    '<td><strong>' + formatCurrency(o.total) + '</strong></td>' +
    '<td><span class="status-pill s-' + (o.status||"pending") + '">' + (o.status||"pending") + '</span></td>' +
    '<td style="color:var(--text-muted)">' + (o.date||"") + '</td></tr>';
  }).join("");
}

function renderBestSellersList() {
  var bs = SBH.getBestSellersByCategory(3); var el = document.getElementById("best-sellers-list"); if (!el) return;
  var html = "";
  ["Cookies","Cakes","Bakery"].forEach(function(cat) {
    var items = bs[cat] || [];
    html += '<h4 style="font-size:.78rem;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin:.8rem 0 .4rem">' + cat + '</h4>';
    if (items.length === 0) { html += '<p style="font-size:.82rem;color:var(--text-muted)">No data yet</p>'; }
    else items.forEach(function(p,i) { html += '<div style="display:flex;align-items:center;gap:.6rem;padding:.35rem 0;border-bottom:1px solid var(--cream-dark)"><span style="font-size:.75rem;font-weight:800;color:var(--rose-deep)">#' + (i+1) + '</span><span>' + p.emoji + '</span><span style="font-size:.85rem;font-weight:600;color:var(--brown-dark);flex:1">' + p.name + '</span><span style="font-size:.78rem;color:var(--text-muted)">$' + p.price.toFixed(2) + '</span></div>'; });
  });
  el.innerHTML = html;
}

// ── PRODUCTS ─────────────────────────────────────────────────────
function renderProducts() {
  var products = SBH.getProducts(); var tbody = document.getElementById("products-tbody"); if (!tbody) return;
  tbody.innerHTML = products.map(function(p) {
    var sl = p.status === "instock" ? "In Stock" : p.status === "soldout" ? "Sold Out" : "Out of Order";
    return '<tr><td><div class="product-row-name"><div class="product-row-emoji">' + p.emoji + '</div><div><div style="font-weight:700">' + p.name + '</div><div style="font-size:.78rem;color:var(--text-muted)">' + (p.allergens||"") + '</div></div></div></td>' +
    '<td>' + p.category + '</td><td><strong>$' + p.price.toFixed(2) + '</strong></td>' +
    '<td><span class="status-pill s-' + p.status + '">' + sl + '</span></td>' +
    '<td>' + (p.bestSeller?"⭐ Yes":"—") + '</td>' +
    '<td><div style="display:flex;gap:.4rem"><button class="btn btn-sm btn-outline" onclick="openEditProduct(' + p.id + ')">Edit</button><button class="btn btn-sm btn-rose" onclick="cycleProductStatus(' + p.id + ')">Status</button></div></td></tr>';
  }).join("");
}
function cycleProductStatus(id) {
  var products = SBH.getProducts(); var p = products.find(function(p) { return p.id === id; }); if (!p) return;
  var cycle = { instock:"soldout", soldout:"outoforder", outoforder:"instock" }; p.status = cycle[p.status] || "instock";
  SBH.saveProducts(products); renderProducts(); showAdminToast(p.name + " is now " + p.status);
}
function openEditProduct(id) {
  var p = SBH.getProducts().find(function(p) { return p.id === id; }); if (!p) return;
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
  var id = parseInt(document.getElementById("edit-product-id").value);
  var products = SBH.getProducts(); var idx = products.findIndex(function(p) { return p.id === id; }); if (idx===-1) return;
  products[idx] = Object.assign({}, products[idx], {
    name: document.getElementById("edit-product-name").value.trim(),
    price: parseFloat(document.getElementById("edit-product-price").value),
    category: document.getElementById("edit-product-cat").value,
    status: document.getElementById("edit-product-status").value,
    desc: document.getElementById("edit-product-desc").value.trim(),
    bestSeller: document.getElementById("edit-product-bs").checked,
    isNew: document.getElementById("edit-product-new").checked,
    featured: document.getElementById("edit-product-feat").checked
  });
  SBH.saveProducts(products); closeOverlay("edit-product-modal"); renderProducts(); showAdminToast("Product updated!");
}
function openAddProductModal() {
  ["new-product-name","new-product-price","new-product-desc","new-product-emoji"].forEach(function(id) { var e = document.getElementById(id); if (e) e.value = ""; });
  openOverlay("add-product-modal");
}
function saveNewProduct() {
  var name  = document.getElementById("new-product-name").value.trim();
  var price = parseFloat(document.getElementById("new-product-price").value);
  var cat   = document.getElementById("new-product-cat").value;
  var desc  = document.getElementById("new-product-desc").value.trim();
  var emoji = document.getElementById("new-product-emoji").value.trim() || "🎉";
  if (!name||!price||!desc) { showAdminToast("Please fill in all required fields."); return; }
  var products = SBH.getProducts();
  var newId    = products.length > 0 ? Math.max.apply(null, products.map(function(p){return p.id;})) + 1 : 1;
  products.push({ id:newId, name, price, category:cat, desc, emoji, longDesc:desc, bestSeller:false, status:"instock", isNew:true, featured:false, allergens:"" });
  SBH.saveProducts(products); closeOverlay("add-product-modal"); renderProducts(); showAdminToast(name + " added!");
}

// ── ORDERS ───────────────────────────────────────────────────────
function renderOrders() {
  var orders = SBH.getOrders(); var tbody = document.getElementById("orders-tbody"); if (!tbody) return;
  if (orders.length === 0) { tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:3rem;color:var(--text-muted);">No orders yet.</td></tr>'; return; }
  tbody.innerHTML = orders.map(function(o) {
    var tipStr = o.tip > 0 ? ' + $' + parseFloat(o.tip).toFixed(2) + ' tip' : '';
    return '<tr><td><strong>#' + o.id + '</strong></td>' +
    '<td><div style="font-weight:700">' + (o.customer||"Guest") + '</div><div style="font-size:.78rem;color:var(--text-muted)">' + (o.email||"") + '</div>' +
    (o.phone ? '<div style="font-size:.78rem;color:var(--text-muted)">' + o.phone + '</div>' : '') + '</td>' +
    '<td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + (o.items||"") + '</td>' +
    '<td><strong>' + formatCurrency(o.total) + '</strong><div style="font-size:.75rem;color:var(--text-muted)">' + tipStr + '</div></td>' +
    '<td>' + (o.method==="delivery"?"🚗 "+o.deliveryAddress:"🏠 Pickup") + '<div style="font-size:.75rem;color:var(--text-muted)">' + ((o.pickupDate||o.deliveryDate)||"") + ' ' + ((o.pickupTime||o.deliveryTime)||"") + '</div></td>' +
    '<td>' + (o.paymentMethod||"Square") + '</td>' +
    '<td><span class="status-pill s-' + (o.status||"pending") + '">' + (o.status||"pending") + '</span></td>' +
    '<td style="color:var(--text-muted)">' + (o.date||"") + '</td>' +
    '<td><div style="display:flex;gap:.3rem;flex-wrap:wrap">' +
    '<select onchange="updateOrderStatus(\'' + o.id + '\',this.value)" style="font-size:.82rem;padding:.3rem .5rem;border:1px solid var(--cream-dark);border-radius:6px;font-family:Nunito">' +
    ['pending','completed','cancelled','out-for-delivery','ready-for-pickup'].map(function(s){ return '<option value="'+s+'"'+(o.status===s?' selected':'')+'>'+s+'</option>'; }).join("") +
    '</select>' +
    '<button class="btn btn-sm btn-outline" onclick="viewInvoice(\'' + o.id + '\')">Invoice</button>' +
    '</div></td></tr>';
  }).join("");
}

async function updateOrderStatus(orderId, newStatus) {
  var updatedOrder = SBH.updateOrder(orderId, { status: newStatus });
  renderOrders();
  showAdminToast("Order #" + orderId + " updated to " + newStatus);
  // Send notification email
  if (updatedOrder) {
    await sendOrderEmail(updatedOrder, "update");
    var msgMap = {
      "completed":          "Your Selly Bake House order #" + orderId + " is complete. Thank you!",
      "out-for-delivery":   "Your Selly Bake House order #" + orderId + " is on its way! 🚗",
      "ready-for-pickup":   "Your Selly Bake House order #" + orderId + " is ready for pickup! 🏠",
      "cancelled":          "Your Selly Bake House order #" + orderId + " has been cancelled."
    };
    if (msgMap[newStatus]) await sendSMSNotification(msgMap[newStatus]);
  }
}

function viewInvoice(orderId) {
  var order = SBH.getOrderById(orderId);
  if (!order) { showAdminToast("Order not found."); return; }
  var html = SBH.generateInvoice(order);
  var win  = window.open("", "_blank");
  win.document.write(html); win.document.close();
}

// ── CAKE REQUESTS ─────────────────────────────────────────────────
function renderCakeRequests() {
  var requests = SBH.getCakeRequests(); var tbody = document.getElementById("cakes-tbody"); if (!tbody) return;
  if (requests.length === 0) { tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:3rem;color:var(--text-muted);">No cake requests yet.</td></tr>'; return; }
  tbody.innerHTML = requests.map(function(r) {
    return '<tr><td><strong>' + r.id + '</strong></td>' +
    '<td><div style="font-weight:700">' + r.name + '</div><div style="font-size:.78rem;color:var(--text-muted)">' + (r.email||"") + '</div></td>' +
    '<td>' + (r.date||"") + '</td><td>' + (r.flavor||"") + ', ' + (r.size||"") + '</td>' +
    '<td style="max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + (r.design||"") + '</td>' +
    '<td><span class="status-pill s-' + (r.status||"pending") + '">' + (r.status||"pending") + '</span></td>' +
    '<td><div style="display:flex;gap:.3rem;flex-wrap:wrap">' +
    '<button class="btn btn-sm btn-primary"  onclick="updateCakeStatus(\'' + r.id + '\',\'approved\')">Approve</button>' +
    '<button class="btn btn-sm btn-outline"  onclick="updateCakeStatus(\'' + r.id + '\',\'rejected\')">Reject</button>' +
    '<button class="btn btn-sm btn-rose"     onclick="viewCakeRequest(\'' + r.id + '\')">View</button>' +
    '</div></td></tr>';
  }).join("");
}
function updateCakeStatus(id, status) { SBH.updateCakeRequest(id, { status }); renderCakeRequests(); showAdminToast("Request " + id + " marked as " + status); }
function viewCakeRequest(id) {
  var req = SBH.getCakeRequests().find(function(r) { return r.id === id; }); if (!req) return;
  var rows = [["Customer",req.name],["Email",req.email||""],["Phone",req.phone||""],["Date",req.date||""],["Size",req.size||""],["Flavor",req.flavor||""],["Frosting",req.frosting||""],["Filling",req.filling||"None"],["Add-ons",req.addons&&req.addons.length?req.addons.join(", "):"None"],["Design",req.design||""],["Method",req.method==="pickup"?"Pickup":"Delivery"],["Notes",req.notes||"None"],["Status",req.status||"pending"],["Submitted",req.submitted||""]];
  var el = document.getElementById("cake-request-detail"); if (!el) return;
  var html = '<h3 style="font-family:Cormorant Garamond,serif;font-size:1.5rem;color:var(--brown-dark);margin-bottom:1rem">Request ' + req.id + '</h3>';
  if (req.imageData) html += '<div style="margin-bottom:1.2rem"><strong style="font-size:.85rem;color:var(--brown)">Reference Image</strong><br><img src="' + req.imageData + '" style="max-width:100%;max-height:250px;border-radius:8px;margin-top:.5rem;border:1.5px solid var(--cream-dark)"></div>';
  html += '<table class="review-table"><tbody>' + rows.map(function(r){return '<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>';}).join("") + '</tbody></table>';
  el.innerHTML = html; openOverlay("cake-detail-modal");
}

// ── BLOCKED DATES ─────────────────────────────────────────────────
function renderBlockedDates() {
  var dates = SBH.getBlockedDates();
  var list  = document.getElementById("blocked-dates-list");
  if (!list) return;
  if (dates.length === 0) {
    list.innerHTML = '<p style="color:var(--text-muted);font-size:.9rem;padding:1rem 0">No blocked dates. Customers can book any available day.</p>';
    return;
  }
  list.innerHTML = dates.sort().map(function(d) {
    var dateObj  = new Date(d + "T00:00:00");
    var label    = dateObj.toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:.7rem 1rem;background:var(--red-bg);border-radius:var(--radius-sm);margin-bottom:.5rem;border:1px solid #FFAAB5">' +
      '<span style="font-weight:700;color:var(--red);font-size:.9rem">🚫 ' + label + '</span>' +
      '<button class="btn btn-sm btn-outline" onclick="unblockDate(\'' + d + '\')" style="font-size:.8rem">Remove</button>' +
    '</div>';
  }).join("");
}

function blockNewDate() {
  var input = document.getElementById("block-date-input");
  if (!input || !input.value) { showAdminToast("Please select a date to block."); return; }
  var dateStr = input.value;
  if (SBH.isDateBlocked(dateStr)) { showAdminToast("This date is already blocked."); return; }
  SBH.addBlockedDate(dateStr);
  input.value = "";
  renderBlockedDates();
  showAdminToast("Date blocked: " + dateStr);
}

function unblockDate(dateStr) {
  SBH.removeBlockedDate(dateStr);
  renderBlockedDates();
  showAdminToast("Date unblocked: " + dateStr);
}

// ── ANALYTICS ────────────────────────────────────────────────────
function renderAnalytics() {
  var orders   = SBH.getOrders(); var products = SBH.getProducts();
  var days     = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]; var values = [0,0,0,0,0,0,0];
  orders.filter(function(o){return o.status==="completed";}).forEach(function(o) {
    var d = new Date(o.date); if (!isNaN(d.getTime())) { var idx = d.getDay()===0?6:d.getDay()-1; values[idx] += parseFloat(o.total)||0; }
  });
  var maxVal = Math.max.apply(null, values) || 1;
  var chartEl = document.getElementById("weekly-chart");
  if (chartEl) {
    chartEl.innerHTML = '<div class="chart-bars">' + values.map(function(v){ return '<div class="chart-bar" style="height:'+Math.round((v/maxVal)*110)+'px"><span>$'+Math.round(v)+'</span></div>'; }).join("") + '</div><div class="chart-labels">' + days.map(function(l){return '<span>'+l+'</span>';}).join("") + '</div>';
  }
  var catEl = document.getElementById("category-breakdown"); var total = products.length || 1;
  if (catEl) {
    catEl.innerHTML = ["Cookies","Cakes","Bakery"].map(function(cat) {
      var count = products.filter(function(p){return p.category===cat;}).length; var pct = Math.round((count/total)*100);
      return '<div style="margin-bottom:.8rem"><div style="display:flex;justify-content:space-between;font-size:.88rem;margin-bottom:.3rem"><span style="font-weight:700;color:var(--brown-dark)">'+cat+'</span><span style="color:var(--text-muted)">'+count+' ('+pct+'%)</span></div><div style="height:8px;background:var(--cream-dark);border-radius:50px;overflow:hidden"><div style="height:100%;width:'+pct+'%;background:var(--rose-deep);border-radius:50px;transition:width .5s"></div></div></div>';
    }).join("");
  }
}

// ── SETTINGS ─────────────────────────────────────────────────────
function renderSettings() {
  var s = SBH.getSettings();
  setToggle("toggle-cakes",  s.cakesEnabled);
  setToggle("toggle-emails", s.emailsEnabled);
  var fields = ["settings-delivery-radius","settings-delivery-fee","settings-square-link","settings-doordash-link","settings-instagram","settings-facebook","settings-tiktok","settings-twitter","settings-cashapp-link","settings-google-review","settings-emailjs-service","settings-emailjs-template","settings-emailjs-update-template","settings-emailjs-autoreply","settings-emailjs-key","settings-sms-number","settings-pickup-start","settings-pickup-end","settings-cake-lead-days"];
  var vals    = [s.deliveryRadius,s.deliveryFee,s.squareLink,s.doordashLink,s.instagramLink,s.facebookLink,s.tiktokLink,s.twitterLink,s.cashappLink,s.googleReviewLink,s.emailjsServiceId,s.emailjsTemplateId,s.emailjsUpdateTemplateId||"",s.emailjsAutoReplyId||"",s.emailjsPublicKey,s.smsNotifyNumber,s.pickupStartHour||9,s.pickupEndHour||18,s.cakeLeadDays||2];
  fields.forEach(function(id, i) { var el = document.getElementById(id); if (el) el.value = vals[i] || ""; });
  renderEmailPreview();
}

function setToggle(id, isOn) {
  var el = document.getElementById(id); if (!el) return;
  el.classList.toggle("on", !!isOn); el.dataset.on = isOn ? "1" : "0";
  el.onclick = function() { var c = el.dataset.on === "1"; el.classList.toggle("on", !c); el.dataset.on = !c ? "1" : "0"; };
}

function saveSettings() {
  var g = function(id) { var e = document.getElementById(id); return e ? e.value.trim() : ""; };
  var cEl = document.getElementById("toggle-cakes"); var eEl = document.getElementById("toggle-emails");
  SBH.saveSettings({
    cakesEnabled:             cEl ? cEl.dataset.on === "1" : true,
    emailsEnabled:            eEl ? eEl.dataset.on === "1" : true,
    deliveryRadius:           g("settings-delivery-radius"),
    deliveryFee:              g("settings-delivery-fee"),
    squareLink:               g("settings-square-link"),
    doordashLink:             g("settings-doordash-link"),
    instagramLink:            g("settings-instagram"),
    facebookLink:             g("settings-facebook"),
    tiktokLink:               g("settings-tiktok"),
    twitterLink:              g("settings-twitter"),
    cashappLink:              g("settings-cashapp-link"),
    googleReviewLink:         g("settings-google-review"),
    emailjsServiceId:         g("settings-emailjs-service"),
    emailjsTemplateId:        g("settings-emailjs-template"),
    emailjsUpdateTemplateId:  g("settings-emailjs-update-template"),
    emailjsAutoReplyId:       g("settings-emailjs-autoreply"),
    emailjsPublicKey:         g("settings-emailjs-key"),
    smsNotifyNumber:          g("settings-sms-number"),
    pickupStartHour:          parseInt(g("settings-pickup-start")) || 9,
    pickupEndHour:            parseInt(g("settings-pickup-end")) || 18,
    cakeLeadDays:             parseInt(g("settings-cake-lead-days")) || 2,
  });
  showAdminToast("Settings saved!");
}

function renderEmailPreview() {
  var bs = SBH.getBestSellersByCategory(3); var prods = SBH.getProducts(); var newProds = prods.filter(function(p){return p.isNew;}).slice(0,3);
  var el = document.getElementById("email-preview-content"); if (!el) return;
  el.innerHTML = '<div class="ep-subject">Weekly Digest — Selly Bake House | ' + new Date().toLocaleDateString("en-US",{month:"long",day:"numeric"}) + '</div>' +
    '<div class="ep-section"><span class="ep-label">New Arrivals:</span> ' + (newProds.map(function(p){return p.name;}).join(", ")||"None this week") + '</div>' +
    '<div class="ep-section"><span class="ep-label">Best Cookies:</span> ' + (bs.Cookies.map(function(p){return p.name;}).join(", ")||"None yet") + '</div>' +
    '<div class="ep-section"><span class="ep-label">Best Cakes:</span> '   + (bs.Cakes.map(function(p){return p.name;}).join(", ")||"None yet") + '</div>' +
    '<div class="ep-section"><span class="ep-label">Best Bakery:</span> '  + (bs.Bakery.map(function(p){return p.name;}).join(", ")||"None yet") + '</div>' +
    '<div class="ep-section">Custom orders: ' + (SBH.getSettings().cakesEnabled?"OPEN":"currently paused") + '</div>';
}

function sendTestEmail() { showAdminToast("Test email sent to sellybakehouse@gmail.com"); }

// ── FEEDBACK ──────────────────────────────────────────────────────
function renderFeedback() {
  var feedbacks = JSON.parse(localStorage.getItem("sbh_feedbacks") || "[]");
  var container = document.getElementById("feedback-list");
  if (!container) return;
  if (feedbacks.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);padding:2rem;text-align:center">No customer feedback yet. After customers place orders they can leave comments on the order success page.</p>';
    return;
  }
  container.innerHTML = feedbacks.map(function(f) {
    var stars = "⭐".repeat(f.rating || 5);
    return '<div style="background:var(--white);border-radius:var(--radius-sm);padding:1.2rem;margin-bottom:.8rem;box-shadow:var(--shadow-sm);border:1.5px solid rgba(240,192,96,0.15)">' +
      '<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:.5rem">' +
        '<div><strong style="color:var(--brown-dark)">' + (f.customer||"Customer") + '</strong><span style="color:var(--text-muted);font-size:.8rem;margin-left:.5rem">— Order #' + f.id + '</span></div>' +
        '<div style="text-align:right"><div style="font-size:.9rem">' + stars + '</div><div style="font-size:.75rem;color:var(--text-muted)">' + (f.date||"") + '</div></div>' +
      '</div>' +
      '<p style="color:var(--text-muted);font-size:.9rem;line-height:1.6">' + f.text + '</p>' +
    '</div>';
  }).join("");
}

// ── USERS ─────────────────────────────────────────────────────────
function renderUsers() {
  if (!currentSession || currentSession.role !== "master") { showAdminToast("Only Master Admins can manage users."); return; }
  var users = SBH.getAdminUsers(); var tbody = document.getElementById("users-tbody"); if (!tbody) return;
  tbody.innerHTML = users.map(function(u) {
    var isSelf = currentSession && u.id === currentSession.id;
    return '<tr><td><div style="font-weight:700">' + u.name + '</div><div style="font-size:.78rem;color:var(--text-muted)">' + u.email + '</div></td>' +
    '<td><span class="status-pill ' + (u.role==="master"?"s-completed":"s-pending") + '">' + (u.role==="master"?"Master Admin":"Staff") + '</span></td>' +
    '<td style="color:var(--text-muted)">' + (u.createdAt||"N/A") + '</td>' +
    '<td>' + (isSelf?'<span style="font-size:.8rem;color:var(--text-muted)">You</span>':'<button class="btn btn-sm btn-rose" onclick="deleteAdminUser(\''+u.id+'\')">Remove</button>') + '</td></tr>';
  }).join("");
}
function openAddUserModal() {
  if (!currentSession || currentSession.role !== "master") { showAdminToast("Only Master Admins can add users."); return; }
  ["new-user-name","new-user-email","new-user-password"].forEach(function(id){ var e = document.getElementById(id); if(e) e.value=""; });
  var r = document.getElementById("new-user-role"); if(r) r.value="staff";
  openOverlay("add-user-modal");
}
function saveNewUser() {
  var name = document.getElementById("new-user-name").value.trim(); var email = document.getElementById("new-user-email").value.trim();
  var pass = document.getElementById("new-user-password").value; var role = document.getElementById("new-user-role").value;
  if (!name||!email||!pass) { showAdminToast("Please fill in all fields."); return; }
  if (SBH.getAdminUsers().find(function(u){return u.email.toLowerCase()===email.toLowerCase();})) { showAdminToast("That email is already registered."); return; }
  SBH.addAdminUser({ name, email, password: pass, role });
  closeOverlay("add-user-modal"); renderUsers(); showAdminToast(name + " added as " + role + "!");
}
function deleteAdminUser(id) {
  if (!currentSession || currentSession.role !== "master") return;
  if (!confirm("Are you sure you want to remove this user?")) return;
  SBH.deleteAdminUser(id); renderUsers(); showAdminToast("User removed.");
}
