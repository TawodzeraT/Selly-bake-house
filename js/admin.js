// ================================================================
// SELLY BAKE HOUSE — ADMIN JS (v4)
// Image management, category CRUD, calendar blocked dates
// ================================================================

var currentSession  = null;
var calendarYear    = new Date().getFullYear();
var calendarMonth   = new Date().getMonth();

document.addEventListener("DOMContentLoaded", function() { checkAdminSession(); });

// ── SESSION ───────────────────────────────────────────────────────
function checkAdminSession() {
  currentSession = SBH.getAdminSession();
  if (!currentSession) { showAdminLoginScreen(); } else { hideAdminLoginScreen(); initAdminPanel(); }
}
function showAdminLoginScreen() {
  var ls = document.getElementById("admin-login-screen");
  var fp = document.getElementById("admin-full-panel");
  if (ls) ls.style.display = "flex"; if (fp) fp.style.display = "none";
  setTimeout(function() { var e = document.getElementById("al-email"); if (e) e.focus(); }, 200);
}
function hideAdminLoginScreen() {
  var ls = document.getElementById("admin-login-screen");
  var fp = document.getElementById("admin-full-panel");
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
    if (btn) { btn.textContent = "Welcome " + user.name.split(" ")[0] + "!"; btn.style.background = "linear-gradient(135deg,#1E6B45,#2D9B65)"; btn.style.color = "white"; }
    setTimeout(function() { hideAdminLoginScreen(); initAdminPanel(); }, 700);
  } else {
    showALError("Wrong email or password.");
    var pi = document.getElementById("al-password"); if (pi) { pi.value = ""; pi.focus(); }
  }
}
function showALError(msg) { var el = document.getElementById("al-error"); if (el) { el.textContent = msg; el.style.display = "block"; } }
function adminLogout() { SBH.clearAdminSession(); currentSession = null; window.location.href = "../index.html"; }

function initAdminPanel() {
  if (!currentSession) return;
  setEl("admin-user-name",   currentSession.name);
  setEl("admin-sidebar-name",currentSession.name);
  setEl("admin-user-role",   currentSession.role === "master" ? "Master Admin" : "Staff");
  var navUsers    = document.getElementById("nav-users");
  var navSettings = document.getElementById("nav-settings");
  if (navUsers)    navUsers.style.display    = currentSession.role === "master" ? "flex" : "none";
  if (navSettings) navSettings.style.display = currentSession.role === "master" ? "flex" : "none";
  initAdminNav();
  showTab("dashboard");
}

function initAdminNav() {
  document.querySelectorAll(".admin-nav-item").forEach(function(item) {
    item.addEventListener("click", function() { if (item.dataset.tab) switchTab(item.dataset.tab); });
  });
}
function switchTab(tab) {
  if ((tab === "users" || tab === "settings" || tab === "categories") && currentSession && currentSession.role !== "master") {
    showAdminToast("Only Master Admins can access this section."); return;
  }
  document.querySelectorAll(".admin-nav-item").forEach(function(i) { i.classList.toggle("active", i.dataset.tab === tab); });
  showTab(tab);
}
function showTab(tab) {
  document.querySelectorAll(".admin-tab").forEach(function(t) { t.style.display = "none"; });
  var el = document.getElementById("tab-" + tab);
  if (el) el.style.display = "block";
  var renderers = {
    dashboard: renderDashboard, analytics: renderAnalytics,
    products: renderProducts, orders: renderOrders,
    cakes: renderCakeRequests, users: renderUsers,
    settings: renderSettings, blocked: renderBlockedDates,
    feedback: renderFeedback, categories: renderCategories
  };
  if (renderers[tab]) renderers[tab]();
}

function setEl(id, val) { var e = document.getElementById(id); if (e) e.textContent = val; }
function getVal(id)     { var e = document.getElementById(id); return e ? e.value.trim() : ""; }
function formatCurrency(n) { return "$" + parseFloat(n || 0).toFixed(2); }
function showAdminToast(msg) {
  var c = document.getElementById("toast-container"); if (!c) return;
  var t = document.createElement("div"); t.className = "toast"; t.textContent = msg; c.appendChild(t);
  setTimeout(function() { t.classList.add("removing"); setTimeout(function() { t.remove(); }, 300); }, 2800);
}

// ── DASHBOARD ─────────────────────────────────────────────────────
function renderDashboard() {
  var orders   = SBH.getOrders(); var products = SBH.getProducts(); var cakeReqs = SBH.getCakeRequests();
  var revenue  = orders.filter(function(o) { return o.status === "completed"; }).reduce(function(s,o) { return s + (parseFloat(o.total)||0); }, 0);
  var pending  = orders.filter(function(o) { return o.status === "pending"; }).length;
  setEl("stat-revenue", formatCurrency(revenue)); setEl("stat-orders", String(orders.length));
  setEl("stat-products", String(products.length)); setEl("stat-cakes", String(cakeReqs.length));
  setEl("stat-pending-sub", pending + " pending");
  renderRecentOrders(); renderBestSellersList();
}

function renderRecentOrders() {
  var orders = SBH.getOrders().slice(0,5); var tbody = document.getElementById("recent-orders-tbody"); if (!tbody) return;
  if (orders.length === 0) { tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-muted)">No orders yet.</td></tr>'; return; }
  tbody.innerHTML = orders.map(function(o) {
    return '<tr><td><strong>#' + o.id + '</strong></td><td>' + (o.customer||"Guest") + '</td>' +
    '<td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + (o.items||"") + '</td>' +
    '<td><strong>' + formatCurrency(o.total) + '</strong></td>' +
    '<td><span class="status-pill s-' + (o.status||"pending") + '">' + (o.status||"pending") + '</span></td>' +
    '<td style="color:var(--text-muted)">' + (o.date||"") + '</td></tr>';
  }).join("");
}

function renderBestSellersList() {
  var products = SBH.getProducts().filter(function(p){return p.bestSeller&&p.status==="instock";}).slice(0,8);
  var cats     = SBH.getCategories();
  var el       = document.getElementById("best-sellers-list"); if (!el) return;
  if (products.length === 0) { el.innerHTML = '<p style="color:var(--text-muted);font-size:.85rem">No best sellers yet. Edit products and tick Best Seller.</p>'; return; }
  el.innerHTML = products.map(function(p,i) {
    var cat   = cats.find(function(c){return c.id===p.category;}); var col = cat ? cat.color : "#9B6340";
    var img   = SBH.getProductImage(p.id);
    return '<div style="display:flex;align-items:center;gap:.7rem;padding:.4rem 0;border-bottom:1px solid var(--cream-dark)">' +
      '<span style="font-size:.75rem;font-weight:800;color:var(--rose-deep);min-width:20px">#' + (i+1) + '</span>' +
      (img ? '<img src="'+img+'" style="width:36px;height:36px;object-fit:cover;border-radius:6px" />' : '<div style="width:36px;height:36px;border-radius:6px;background:'+col+'22;display:flex;align-items:center;justify-content:center"><div style="width:16px;height:16px;border-radius:50%;background:'+col+'55"></div></div>') +
      '<span style="font-size:.85rem;font-weight:600;color:var(--brown-dark);flex:1">' + p.name + '</span>' +
      '<span style="font-size:.78rem;color:var(--text-muted)">$' + p.price.toFixed(2) + '</span>' +
    '</div>';
  }).join("");
}

// ── PRODUCTS ──────────────────────────────────────────────────────
function renderProducts() {
  var products = SBH.getProducts(); var cats = SBH.getCategories();
  var tbody = document.getElementById("products-tbody"); if (!tbody) return;
  tbody.innerHTML = products.map(function(p) {
    var cat = cats.find(function(c){return c.id===p.category;}); var catName = cat ? cat.name : p.category; var catColor = cat ? cat.color : "#9B6340";
    var img = SBH.getProductImage(p.id);
    var sl  = p.status === "instock" ? "In Stock" : p.status === "soldout" ? "Sold Out" : "Out of Order";
    return '<tr>' +
      '<td><div class="product-row-name">' +
        (img ? '<img src="'+img+'" style="width:44px;height:44px;object-fit:cover;border-radius:8px;border:1.5px solid var(--cream-dark)" />' :
               '<div style="width:44px;height:44px;border-radius:8px;background:'+catColor+'22;display:flex;align-items:center;justify-content:center;border:1.5px solid var(--cream-dark)"><div style="width:20px;height:20px;border-radius:50%;background:'+catColor+'66"></div></div>') +
        '<div><div style="font-weight:700">' + p.name + '</div>' +
        '<div style="font-size:.75rem;color:var(--text-muted)">' + (p.allergens||"") + '</div></div>' +
      '</div></td>' +
      '<td><span style="background:'+catColor+';color:white;padding:.15rem .6rem;border-radius:4px;font-size:.7rem;font-weight:700">' + catName + '</span></td>' +
      '<td><strong>$' + p.price.toFixed(2) + '</strong></td>' +
      '<td><span class="status-pill s-' + p.status + '">' + sl + '</span></td>' +
      '<td>' + (p.bestSeller?"Yes":"—") + '</td>' +
      '<td><div style="display:flex;gap:.3rem">' +
        '<button class="btn btn-sm btn-outline" onclick="openEditProduct('+p.id+')">Edit</button>' +
        '<button class="btn btn-sm" style="background:var(--cream-dark);color:var(--brown);border:none;border-radius:6px;padding:.3rem .7rem;cursor:pointer" onclick="openImageModal('+p.id+')">Image</button>' +
        '<button class="btn btn-sm btn-rose" onclick="cycleProductStatus('+p.id+')">Status</button>' +
      '</div></td></tr>';
  }).join("");
}

function cycleProductStatus(id) {
  var products = SBH.getProducts(); var p = products.find(function(p){return p.id===id;}); if (!p) return;
  var cycle = { instock:"soldout", soldout:"outoforder", outoforder:"instock" };
  p.status = cycle[p.status] || "instock";
  SBH.saveProducts(products); renderProducts(); showAdminToast(p.name + " is now " + p.status);
}

function openEditProduct(id) {
  var p = SBH.getProducts().find(function(p){return p.id===id;}); if (!p) return;
  var cats = SBH.getCategories();
  // Populate category dropdown
  var catSel = document.getElementById("edit-product-cat");
  if (catSel) {
    catSel.innerHTML = cats.map(function(c) { return '<option value="'+c.id+'"'+(p.category===c.id?" selected":"")+'>'+c.name+'</option>'; }).join("");
  }
  document.getElementById("edit-product-id").value     = p.id;
  document.getElementById("edit-product-name").value   = p.name;
  document.getElementById("edit-product-price").value  = p.price;
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
  var idx      = products.findIndex(function(p){return p.id===id;}); if (idx===-1) return;
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
  SBH.saveProducts(products); closeOverlay("edit-product-modal"); renderProducts(); showAdminToast("Product updated!");
}

function openAddProductModal() {
  var cats = SBH.getCategories();
  var catSel = document.getElementById("new-product-cat");
  if (catSel) catSel.innerHTML = cats.map(function(c){return '<option value="'+c.id+'">'+c.name+'</option>';}).join("");
  ["new-product-name","new-product-price","new-product-desc"].forEach(function(id){ var e = document.getElementById(id); if (e) e.value = ""; });
  openOverlay("add-product-modal");
}

function saveNewProduct() {
  var name  = getVal("new-product-name"); var price = parseFloat(document.getElementById("new-product-price")?.value||0);
  var cat   = getVal("new-product-cat");  var desc  = getVal("new-product-desc");
  if (!name||!price||!desc) { showAdminToast("Please fill in all required fields."); return; }
  var products = SBH.getProducts();
  var newId    = products.length > 0 ? Math.max.apply(null, products.map(function(p){return p.id;})) + 1 : 1;
  products.push({ id:newId, name, price, category:cat||"cookies", desc, image:"", longDesc:desc, bestSeller:false, status:"instock", isNew:true, featured:false, allergens:"" });
  SBH.saveProducts(products); closeOverlay("add-product-modal"); renderProducts(); showAdminToast(name + " added!");
}

// ── IMAGE MANAGEMENT ──────────────────────────────────────────────
var _imageModalProductId = null;

function openImageModal(productId) {
  _imageModalProductId = productId;
  var p    = SBH.getProducts().find(function(p){return p.id===productId;});
  var img  = SBH.getProductImage(productId);
  var el   = document.getElementById("image-modal-content");
  if (!el) return;

  el.innerHTML =
    '<h3 style="font-family:Cormorant Garamond,serif;font-size:1.5rem;color:var(--brown-dark);margin-bottom:1rem">Manage Image — ' + (p?p.name:"") + '</h3>' +
    (img
      ? '<div style="margin-bottom:1rem"><img src="'+img+'" style="max-width:100%;max-height:220px;border-radius:10px;border:1.5px solid var(--cream-dark)" /><div style="margin-top:.5rem;font-size:.82rem;color:var(--green);font-weight:700">Image uploaded</div></div>' +
        '<div style="display:flex;gap:.6rem">' +
        '<label style="flex:1;display:flex;align-items:center;justify-content:center;gap:.4rem;padding:.6rem;background:var(--cream);border:1.5px dashed var(--cream-mid);border-radius:8px;cursor:pointer;font-size:.85rem;font-weight:700;color:var(--brown)">' +
          'Replace Image<input type="file" accept="image/*" style="display:none" onchange="handleImageUpload(this,' + productId + ')" />' +
        '</label>' +
        '<button class="btn btn-rose btn-sm" onclick="deleteProductImage('+productId+')">Delete Image</button>' +
        '</div>'
      : '<div style="border:2px dashed var(--cream-mid);border-radius:10px;padding:2.5rem;text-align:center;margin-bottom:1rem">' +
          '<div style="font-size:.9rem;font-weight:700;color:var(--brown);margin-bottom:.3rem">No image uploaded</div>' +
          '<div style="font-size:.8rem;color:var(--text-muted);margin-bottom:1rem">Upload a photo of this product to display it in your shop.</div>' +
          '<label style="display:inline-flex;align-items:center;gap:.5rem;padding:.7rem 1.4rem;background:var(--brown-dark);color:var(--cream);border-radius:50px;cursor:pointer;font-size:.85rem;font-weight:700">' +
            'Choose Photo<input type="file" accept="image/*" style="display:none" onchange="handleImageUpload(this,' + productId + ')" />' +
          '</label>' +
        '</div>'
    );

  openOverlay("image-modal");
}

function handleImageUpload(input, productId) {
  var file = input.files && input.files[0]; if (!file) return;
  if (file.size > 4 * 1024 * 1024) { showAdminToast("Image too large. Please use an image under 4MB."); return; }
  var reader = new FileReader();
  reader.onload = function(e) {
    SBH.saveProductImage(productId, e.target.result);
    closeOverlay("image-modal");
    renderProducts();
    showAdminToast("Image saved!");
  };
  reader.readAsDataURL(file);
}

function deleteProductImage(productId) {
  if (!confirm("Are you sure you want to remove this image?")) return;
  SBH.deleteProductImage(productId);
  closeOverlay("image-modal");
  renderProducts();
  showAdminToast("Image removed.");
}

// ── CATEGORIES ────────────────────────────────────────────────────
function renderCategories() {
  var cats  = SBH.getCategories().sort(function(a,b){return a.order-b.order;});
  var tbody = document.getElementById("categories-tbody"); if (!tbody) return;
  tbody.innerHTML = cats.map(function(cat, i) {
    return '<tr>' +
      '<td>' +
        '<div style="display:flex;align-items:center;gap:.7rem">' +
          '<div style="width:32px;height:32px;border-radius:8px;background:' + cat.color + ';display:flex;align-items:center;justify-content:center">' +
            '<div style="width:14px;height:14px;border-radius:50%;background:rgba(255,255,255,0.5)"></div>' +
          '</div>' +
          '<strong>' + cat.name + '</strong>' +
        '</div>' +
      '</td>' +
      '<td><code style="background:var(--cream-dark);padding:.1rem .5rem;border-radius:4px;font-size:.8rem">' + cat.id + '</code></td>' +
      '<td><span style="background:' + cat.color + '22;color:' + cat.color + ';padding:.2rem .7rem;border-radius:50px;font-size:.8rem;font-weight:700">' + cat.color + '</span></td>' +
      '<td>' + cat.order + '</td>' +
      '<td><span class="status-pill ' + (cat.active?"s-completed":"s-cancelled") + '">' + (cat.active?"Active":"Hidden") + '</span></td>' +
      '<td><div style="display:flex;gap:.3rem">' +
        '<button class="btn btn-sm btn-outline" onclick="openEditCategory(\'' + cat.id + '\')">Edit</button>' +
        (i > 0 ? '<button class="btn btn-sm" style="background:var(--cream-dark);border:none;border-radius:6px;padding:.3rem .6rem;cursor:pointer" onclick="moveCategoryUp(\'' + cat.id + '\')">&#8679;</button>' : '') +
        (i < cats.length-1 ? '<button class="btn btn-sm" style="background:var(--cream-dark);border:none;border-radius:6px;padding:.3rem .6rem;cursor:pointer" onclick="moveCategoryDown(\'' + cat.id + '\')">&#8681;</button>' : '') +
        '<button class="btn btn-sm btn-rose" onclick="deleteCategoryConfirm(\'' + cat.id + '\')">Delete</button>' +
      '</div></td>' +
    '</tr>';
  }).join("");
}

function openEditCategory(id) {
  var cat = SBH.getCategoryById(id); if (!cat) return;
  document.getElementById("edit-cat-id").value    = cat.id;
  document.getElementById("edit-cat-name").value  = cat.name;
  document.getElementById("edit-cat-color").value = cat.color;
  var activeEl = document.getElementById("edit-cat-active");
  if (activeEl) activeEl.checked = cat.active;
  openOverlay("edit-category-modal");
}

function saveEditCategory() {
  var id    = getVal("edit-cat-id");
  var name  = getVal("edit-cat-name");
  var color = getVal("edit-cat-color");
  var active= document.getElementById("edit-cat-active")?.checked ?? true;
  if (!name) { showAdminToast("Please enter a category name."); return; }
  SBH.updateCategory(id, { name, color, active });
  closeOverlay("edit-category-modal"); renderCategories(); showAdminToast("Category updated!");
}

function openAddCategoryModal() {
  ["add-cat-name","add-cat-color"].forEach(function(id){ var e=document.getElementById(id); if(e) e.value=""; });
  var colorEl = document.getElementById("add-cat-color"); if (colorEl) colorEl.value = "#D4637A";
  openOverlay("add-category-modal");
}

function saveNewCategory() {
  var name  = getVal("add-cat-name"); var color = getVal("add-cat-color") || "#D4637A";
  if (!name) { showAdminToast("Please enter a category name."); return; }
  var id = name.toLowerCase().replace(/[^a-z0-9]/g,"_");
  var existing = SBH.getCategories().find(function(c){return c.id===id;});
  if (existing) { showAdminToast("A category with that name already exists."); return; }
  SBH.addCategory({ id, name, color, icon:"" });
  closeOverlay("add-category-modal"); renderCategories(); showAdminToast(name + " category added!");
}

function deleteCategoryConfirm(id) {
  var cat = SBH.getCategoryById(id); if (!cat) return;
  var count = SBH.getProducts().filter(function(p){return p.category===id;}).length;
  var msg   = "Delete category \"" + cat.name + "\"?";
  if (count > 0) msg += "\n\nWarning: " + count + " product(s) are assigned to this category.";
  if (!confirm(msg)) return;
  SBH.deleteCategory(id); renderCategories(); showAdminToast("Category deleted.");
}

function moveCategoryUp(id) {
  var cats  = SBH.getCategories().sort(function(a,b){return a.order-b.order;});
  var idx   = cats.findIndex(function(c){return c.id===id;}); if (idx <= 0) return;
  cats[idx].order   = idx;
  cats[idx-1].order = idx + 1;
  SBH.saveCategories(cats); renderCategories();
}
function moveCategoryDown(id) {
  var cats  = SBH.getCategories().sort(function(a,b){return a.order-b.order;});
  var idx   = cats.findIndex(function(c){return c.id===id;}); if (idx >= cats.length-1) return;
  cats[idx].order   = idx + 2;
  cats[idx+1].order = idx + 1;
  SBH.saveCategories(cats); renderCategories();
}

// ── BLOCKED DATES CALENDAR ────────────────────────────────────────
function renderBlockedDates() {
  renderCalendar();
  renderBlockedList();
}

function renderCalendar() {
  var blocked = SBH.getBlockedDates();
  var el      = document.getElementById("blocked-calendar"); if (!el) return;

  var today   = new Date();
  var year    = calendarYear;
  var month   = calendarMonth;
  var first   = new Date(year, month, 1);
  var days    = new Date(year, month + 1, 0).getDate();
  var start   = first.getDay();

  var months  = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  var html = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">' +
    '<button onclick="calPrev()" style="background:var(--cream-dark);border:none;border-radius:8px;padding:.5rem .9rem;cursor:pointer;font-weight:700;font-size:1rem;color:var(--brown)">&#8592;</button>' +
    '<strong style="font-size:1.1rem;color:var(--brown-dark)">' + months[month] + " " + year + '</strong>' +
    '<button onclick="calNext()" style="background:var(--cream-dark);border:none;border-radius:8px;padding:.5rem .9rem;cursor:pointer;font-weight:700;font-size:1rem;color:var(--brown)">&#8594;</button>' +
  '</div>' +
  '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center;margin-bottom:4px">' +
  ["Su","Mo","Tu","We","Th","Fr","Sa"].map(function(d){ return '<div style="font-size:.72rem;font-weight:800;color:var(--text-muted);padding:.3rem 0">' + d + '</div>'; }).join("") +
  '</div>' +
  '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px">';

  // Empty cells before month start
  for (var i = 0; i < start; i++) html += '<div></div>';

  for (var d = 1; d <= days; d++) {
    var dateStr   = year + "-" + String(month+1).padStart(2,"0") + "-" + String(d).padStart(2,"0");
    var isBlocked = blocked.includes(dateStr);
    var isToday   = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    var isPast    = new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

    var bg    = isBlocked ? "var(--rose-deep)" : isToday ? "var(--brown-dark)" : "var(--cream-dark)";
    var color = (isBlocked || isToday) ? "white" : isPast ? "var(--text-muted)" : "var(--brown-dark)";
    var opacity = isPast && !isBlocked ? "0.5" : "1";
    var cursor  = isPast ? "default" : "pointer";

    html += '<div onclick="' + (!isPast ? "toggleCalendarDate('" + dateStr + "')" : "") + '" ' +
      'style="background:' + bg + ';color:' + color + ';border-radius:8px;padding:.55rem .2rem;text-align:center;font-size:.85rem;font-weight:700;cursor:' + cursor + ';opacity:' + opacity + ';transition:all .15s" ' +
      'title="' + dateStr + (isBlocked ? " — Blocked (click to unblock)" : (isPast ? "" : " — Click to block")) + '">' +
      d + '</div>';
  }

  html += '</div>';
  html += '<div style="display:flex;gap:1rem;margin-top:1rem;font-size:.78rem;flex-wrap:wrap">' +
    '<span style="display:flex;align-items:center;gap:.4rem"><span style="width:12px;height:12px;background:var(--rose-deep);border-radius:3px;display:inline-block"></span>Blocked date</span>' +
    '<span style="display:flex;align-items:center;gap:.4rem"><span style="width:12px;height:12px;background:var(--brown-dark);border-radius:3px;display:inline-block"></span>Today</span>' +
    '<span style="color:var(--text-muted)">Click any future date to block or unblock it</span>' +
  '</div>';

  el.innerHTML = html;
}

function calPrev() { calendarMonth--; if (calendarMonth < 0) { calendarMonth = 11; calendarYear--; } renderCalendar(); }
function calNext() { calendarMonth++; if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; } renderCalendar(); }

function toggleCalendarDate(dateStr) {
  if (SBH.isDateBlocked(dateStr)) { SBH.removeBlockedDate(dateStr); showAdminToast("Unblocked: " + dateStr); }
  else                            { SBH.addBlockedDate(dateStr);    showAdminToast("Blocked: " + dateStr); }
  renderCalendar();
  renderBlockedList();
}

function renderBlockedList() {
  var dates = SBH.getBlockedDates().sort();
  var list  = document.getElementById("blocked-dates-list"); if (!list) return;
  if (dates.length === 0) {
    list.innerHTML = '<p style="color:var(--text-muted);font-size:.88rem;padding:.5rem 0">No blocked dates. Click on any calendar date to block it.</p>'; return;
  }
  list.innerHTML = dates.map(function(d) {
    var obj   = new Date(d + "T00:00:00");
    var label = obj.toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:.6rem .9rem;background:var(--red-bg);border-radius:var(--radius-sm);margin-bottom:.4rem;border:1px solid #FFAAB5">' +
      '<span style="font-weight:700;color:var(--red);font-size:.85rem">' + label + '</span>' +
      '<button class="btn btn-sm btn-outline" onclick="toggleCalendarDate(\'' + d + '\')" style="font-size:.78rem">Unblock</button>' +
    '</div>';
  }).join("");
}

// ── ORDERS ────────────────────────────────────────────────────────
function renderOrders() {
  var orders = SBH.getOrders(); var tbody = document.getElementById("orders-tbody"); if (!tbody) return;
  if (orders.length === 0) { tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:3rem;color:var(--text-muted)">No orders yet.</td></tr>'; return; }
  tbody.innerHTML = orders.map(function(o) {
    return '<tr><td><strong>#' + o.id + '</strong></td>' +
    '<td><div style="font-weight:700">' + (o.customer||"Guest") + '</div><div style="font-size:.75rem;color:var(--text-muted)">' + (o.email||"") + '</div></td>' +
    '<td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + (o.items||"") + '</td>' +
    '<td><strong>' + formatCurrency(o.total) + '</strong>' + (o.tip>0?'<div style="font-size:.72rem;color:var(--text-muted)">incl. $'+parseFloat(o.tip).toFixed(2)+' tip</div>':'') + '</td>' +
    '<td>' + (o.method==="delivery"?"Delivery":"Pickup") + '<div style="font-size:.72rem;color:var(--text-muted)">' + ((o.pickupDate||o.deliveryDate)||"") + ' ' + ((o.pickupTime||o.deliveryTime)||"") + '</div></td>' +
    '<td>' + (o.paymentMethod||"Square") + '</td>' +
    '<td><span class="status-pill s-' + (o.status||"pending") + '">' + (o.status||"pending") + '</span></td>' +
    '<td style="color:var(--text-muted)">' + (o.date||"") + '</td>' +
    '<td><div style="display:flex;gap:.3rem;flex-wrap:wrap">' +
    '<select onchange="updateOrderStatus(\''+o.id+'\',this.value)" style="font-size:.8rem;padding:.25rem .4rem;border:1px solid var(--cream-dark);border-radius:6px;font-family:Nunito">' +
    ['pending','completed','cancelled','out-for-delivery','ready-for-pickup'].map(function(s){return '<option value="'+s+'"'+(o.status===s?' selected':'')+'>'+s+'</option>';}).join("") +
    '</select>' +
    '<button class="btn btn-sm btn-outline" onclick="viewInvoice(\''+o.id+'\')" style="font-size:.75rem">Invoice</button>' +
    '</div></td></tr>';
  }).join("");
}

async function updateOrderStatus(orderId, newStatus) {
  var updated = SBH.updateOrder(orderId, { status: newStatus });
  renderOrders(); showAdminToast("Order #" + orderId + " updated to " + newStatus);
  if (updated && typeof sendOrderEmail === "function") await sendOrderEmail(updated, "update");
}

function viewInvoice(orderId) {
  var order = SBH.getOrderById(orderId); if (!order) { showAdminToast("Order not found."); return; }
  var win   = window.open("", "_blank"); win.document.write(SBH.generateInvoice(order)); win.document.close();
}

// ── CAKE REQUESTS ─────────────────────────────────────────────────
function renderCakeRequests() {
  var reqs  = SBH.getCakeRequests(); var tbody = document.getElementById("cakes-tbody"); if (!tbody) return;
  if (reqs.length === 0) { tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:3rem;color:var(--text-muted)">No cake requests yet.</td></tr>'; return; }
  tbody.innerHTML = reqs.map(function(r) {
    return '<tr><td><strong>'+r.id+'</strong></td><td><div style="font-weight:700">'+r.name+'</div><div style="font-size:.75rem;color:var(--text-muted)">'+(r.email||"")+'</div></td><td>'+(r.date||"")+'</td><td>'+(r.flavor||"")+', '+(r.size||"")+'</td><td style="max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+(r.design||"")+'</td><td><span class="status-pill s-'+(r.status||"pending")+'">'+(r.status||"pending")+'</span></td>' +
    '<td><div style="display:flex;gap:.3rem;flex-wrap:wrap"><button class="btn btn-sm btn-primary" onclick="updateCakeStatus(\''+r.id+'\',\'approved\')">Approve</button><button class="btn btn-sm btn-outline" onclick="updateCakeStatus(\''+r.id+'\',\'rejected\')">Reject</button><button class="btn btn-sm btn-rose" onclick="viewCakeRequest(\''+r.id+'\')">View</button></div></td></tr>';
  }).join("");
}
function updateCakeStatus(id, status) { SBH.updateCakeRequest(id, { status }); renderCakeRequests(); showAdminToast("Request " + id + " " + status); }
function viewCakeRequest(id) {
  var r = SBH.getCakeRequests().find(function(r){return r.id===id;}); if (!r) return;
  var rows = [["Customer",r.name],["Email",r.email||""],["Phone",r.phone||""],["Date",r.date||""],["Size",r.size||""],["Flavor",r.flavor||""],["Frosting",r.frosting||""],["Filling",r.filling||""],["Add-ons",r.addons&&r.addons.length?r.addons.join(", "):"None"],["Design",r.design||""],["Method",r.method==="pickup"?"Pickup":"Delivery"],["Notes",r.notes||"None"],["Status",r.status||"pending"]];
  var el = document.getElementById("cake-request-detail"); if (!el) return;
  var html = '<h3 style="font-family:Cormorant Garamond,serif;font-size:1.5rem;color:var(--brown-dark);margin-bottom:1rem">Request ' + r.id + '</h3>';
  if (r.imageData) html += '<div style="margin-bottom:1rem"><strong style="font-size:.82rem;color:var(--brown);display:block;margin-bottom:.4rem">Reference Image</strong><img src="'+r.imageData+'" style="max-width:100%;max-height:240px;border-radius:8px;border:1.5px solid var(--cream-dark)"></div>';
  html += '<table class="review-table"><tbody>' + rows.map(function(r){return '<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>';}).join("") + '</tbody></table>';
  el.innerHTML = html; openOverlay("cake-detail-modal");
}

// ── ANALYTICS ─────────────────────────────────────────────────────
function renderAnalytics() {
  var orders   = SBH.getOrders(); var products = SBH.getProducts(); var cats = SBH.getCategories();
  var days     = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]; var values = [0,0,0,0,0,0,0];
  orders.filter(function(o){return o.status==="completed";}).forEach(function(o) {
    var d = new Date(o.date); if (!isNaN(d.getTime())) { var i = d.getDay()===0?6:d.getDay()-1; values[i]+=parseFloat(o.total)||0; }
  });
  var maxVal  = Math.max.apply(null,values)||1;
  var chartEl = document.getElementById("weekly-chart");
  if (chartEl) {
    chartEl.innerHTML = '<div class="chart-bars">' + values.map(function(v){return '<div class="chart-bar" style="height:'+Math.round((v/maxVal)*110)+'px"><span>$'+Math.round(v)+'</span></div>';}).join("") + '</div><div class="chart-labels">' + days.map(function(l){return '<span>'+l+'</span>';}).join("") + '</div>';
  }
  var total   = products.length||1; var catEl = document.getElementById("category-breakdown");
  if (catEl) {
    catEl.innerHTML = cats.map(function(cat) {
      var count = products.filter(function(p){return p.category===cat.id;}).length;
      var pct   = Math.round((count/total)*100);
      return '<div style="margin-bottom:.8rem"><div style="display:flex;justify-content:space-between;font-size:.85rem;margin-bottom:.3rem"><span style="font-weight:700;color:var(--brown-dark)">'+cat.name+'</span><span style="color:var(--text-muted)">'+count+' products ('+pct+'%)</span></div><div style="height:8px;background:var(--cream-dark);border-radius:50px;overflow:hidden"><div style="height:100%;width:'+pct+'%;background:'+cat.color+';border-radius:50px;transition:width .5s"></div></div></div>';
    }).join("");
  }
}

// ── SETTINGS ──────────────────────────────────────────────────────
function renderSettings() {
  var s = SBH.getSettings();
  setToggle("toggle-cakes",  s.cakesEnabled);
  setToggle("toggle-emails", s.emailsEnabled);
  var fields = ["settings-delivery-radius","settings-delivery-fee","settings-square-link","settings-doordash-link","settings-instagram","settings-facebook","settings-tiktok","settings-twitter","settings-cashapp-link","settings-google-review","settings-emailjs-service","settings-emailjs-template","settings-emailjs-key","settings-sms-number","settings-pickup-start","settings-pickup-end","settings-cake-lead-days"];
  var vals   = [s.deliveryRadius,s.deliveryFee,s.squareLink,s.doordashLink,s.instagramLink,s.facebookLink,s.tiktokLink,s.twitterLink,s.cashappLink,s.googleReviewLink,s.emailjsServiceId,s.emailjsTemplateId,s.emailjsPublicKey,s.smsNotifyNumber,s.pickupStartHour||9,s.pickupEndHour||18,s.cakeLeadDays||2];
  fields.forEach(function(id,i){ var e=document.getElementById(id); if (e) e.value=vals[i]||""; });
  renderEmailPreview();
}
function setToggle(id, isOn) {
  var el = document.getElementById(id); if (!el) return;
  el.classList.toggle("on", !!isOn); el.dataset.on = isOn?"1":"0";
  el.onclick = function() { var c=el.dataset.on==="1"; el.classList.toggle("on",!c); el.dataset.on=!c?"1":"0"; };
}
function saveSettings() {
  var g = function(id){ var e=document.getElementById(id); return e?e.value.trim():""; };
  var cEl=document.getElementById("toggle-cakes"), eEl=document.getElementById("toggle-emails");
  SBH.saveSettings({ cakesEnabled:cEl?cEl.dataset.on==="1":true, emailsEnabled:eEl?eEl.dataset.on==="1":true, deliveryRadius:g("settings-delivery-radius"), deliveryFee:g("settings-delivery-fee"), squareLink:g("settings-square-link"), doordashLink:g("settings-doordash-link"), instagramLink:g("settings-instagram"), facebookLink:g("settings-facebook"), tiktokLink:g("settings-tiktok"), twitterLink:g("settings-twitter"), cashappLink:g("settings-cashapp-link"), googleReviewLink:g("settings-google-review"), emailjsServiceId:g("settings-emailjs-service"), emailjsTemplateId:g("settings-emailjs-template"), emailjsPublicKey:g("settings-emailjs-key"), smsNotifyNumber:g("settings-sms-number"), pickupStartHour:parseInt(g("settings-pickup-start"))||9, pickupEndHour:parseInt(g("settings-pickup-end"))||18, cakeLeadDays:parseInt(g("settings-cake-lead-days"))||2 });
  showAdminToast("Settings saved!");
}
function renderEmailPreview() {
  var bs=SBH.getBestSellersByCategory(3); var prods=SBH.getProducts(); var newProds=prods.filter(function(p){return p.isNew;}).slice(0,3);
  var el=document.getElementById("email-preview-content"); if (!el) return;
  var cats=SBH.getCategories();
  var bsLines = cats.map(function(c){ var items=bs[c.id]||[]; return items.length?'<div class="ep-section"><span class="ep-label">Best '+c.name+':</span> '+items.map(function(p){return p.name;}).join(", ")+'</div>':""; }).join("");
  el.innerHTML='<div class="ep-subject">Weekly Digest — Selly Bake House | '+new Date().toLocaleDateString("en-US",{month:"long",day:"numeric"})+'</div><div class="ep-section"><span class="ep-label">New Arrivals:</span> '+(newProds.map(function(p){return p.name;}).join(", ")||"None this week")+'</div>'+bsLines+'<div class="ep-section">Custom orders: '+(SBH.getSettings().cakesEnabled?"OPEN":"currently paused")+'</div>';
}
function sendTestEmail() { showAdminToast("Test email sent to sellybakehouse@gmail.com"); }

// ── FEEDBACK ──────────────────────────────────────────────────────
function renderFeedback() {
  var feedbacks = JSON.parse(localStorage.getItem("sbh_feedbacks")||"[]");
  var container = document.getElementById("feedback-list"); if (!container) return;
  if (feedbacks.length===0) { container.innerHTML='<p style="color:var(--text-muted);padding:2rem;text-align:center">No feedback yet.</p>'; return; }
  container.innerHTML = feedbacks.map(function(f) {
    var stars = "";
    for (var i=0;i<(f.rating||5);i++) stars += '<span style="color:#F0C060;font-size:1rem">&#9733;</span>';
    return '<div style="background:var(--white);border-radius:var(--radius-sm);padding:1.2rem;margin-bottom:.7rem;box-shadow:var(--shadow-sm);border:1.5px solid rgba(240,192,96,0.15)"><div style="display:flex;justify-content:space-between;margin-bottom:.5rem"><div><strong style="color:var(--brown-dark)">'+(f.customer||"Customer")+'</strong><span style="color:var(--text-muted);font-size:.78rem;margin-left:.5rem">— Order #'+f.id+'</span></div><div style="text-align:right">'+stars+'<div style="font-size:.72rem;color:var(--text-muted)">'+(f.date||"")+'</div></div></div><p style="color:var(--text-muted);font-size:.88rem;line-height:1.6">'+f.text+'</p></div>';
  }).join("");
}

// ── USERS ─────────────────────────────────────────────────────────
function renderUsers() {
  if (!currentSession||currentSession.role!=="master") { showAdminToast("Only Master Admins can manage users."); return; }
  var users=SBH.getAdminUsers(); var tbody=document.getElementById("users-tbody"); if (!tbody) return;
  tbody.innerHTML = users.map(function(u) {
    var isSelf=currentSession&&u.id===currentSession.id;
    return '<tr><td><div style="font-weight:700">'+u.name+'</div><div style="font-size:.75rem;color:var(--text-muted)">'+u.email+'</div></td><td><span class="status-pill '+(u.role==="master"?"s-completed":"s-pending")+'">'+(u.role==="master"?"Master Admin":"Staff")+'</span></td><td style="color:var(--text-muted)">'+(u.createdAt||"")+'</td><td>'+(isSelf?'<span style="font-size:.8rem;color:var(--text-muted)">You</span>':'<button class="btn btn-sm btn-rose" onclick="deleteAdminUser(\''+u.id+'\')">Remove</button>')+'</td></tr>';
  }).join("");
}
function openAddUserModal() {
  if (!currentSession||currentSession.role!=="master") { showAdminToast("Only Master Admins can add users."); return; }
  ["new-user-name","new-user-email","new-user-password"].forEach(function(id){var e=document.getElementById(id);if(e)e.value="";});
  var r=document.getElementById("new-user-role"); if(r) r.value="staff";
  openOverlay("add-user-modal");
}
function saveNewUser() {
  var name=getVal("new-user-name"),email=getVal("new-user-email"),pass=document.getElementById("new-user-password")?.value,role=getVal("new-user-role");
  if(!name||!email||!pass){showAdminToast("Please fill in all fields.");return;}
  if(SBH.getAdminUsers().find(function(u){return u.email.toLowerCase()===email.toLowerCase();})){showAdminToast("That email is already registered.");return;}
  SBH.addAdminUser({name,email,password:pass,role});
  closeOverlay("add-user-modal"); renderUsers(); showAdminToast(name+" added as "+role+"!");
}
function deleteAdminUser(id) {
  if(!currentSession||currentSession.role!=="master")return;
  if(!confirm("Remove this user?"))return;
  SBH.deleteAdminUser(id); renderUsers(); showAdminToast("User removed.");
}
