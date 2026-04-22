// ================================================================
// SELLY BAKE HOUSE — SHOP JS
// Live search, filtering, sorting, categories
// ================================================================

var shopState = {
  category:   "all",
  sort:       "default",
  search:     "",
  filters:    { instock: false, bestseller: false, newonly: false },
};

document.addEventListener("DOMContentLoaded", function() {
  // Read URL param for category deep links
  var params = new URLSearchParams(window.location.search);
  if (params.get("cat")) shopState.category = params.get("cat").toLowerCase();

  initCategories();
  renderProducts();
  renderFooterCatLinks();
  SBH.updateCartBadge();

  // Mark active cat pill
  document.querySelectorAll(".cat-pill").forEach(function(p) {
    p.classList.toggle("active", p.dataset.cat === shopState.category);
  });
});

// ── CATEGORIES ───────────────────────────────────────────────────
function initCategories() {
  var cats  = SBH.getCategories().filter(function(c) { return c.active; })
               .sort(function(a,b) { return a.order - b.order; });
  var pills = document.getElementById("cat-pills");
  if (!pills) return;

  pills.innerHTML = '<button class="cat-pill ' + (shopState.category === "all" ? "active" : "") + '" data-cat="all" onclick="setCategory(\'all\')">All Items</button>';

  cats.forEach(function(cat) {
    var active = shopState.category === cat.id ? "active" : "";
    pills.innerHTML += '<button class="cat-pill ' + active + '" data-cat="' + cat.id + '" onclick="setCategory(\'' + cat.id + '\')" style="' + (active ? "" : "border-color:transparent") + '">' + cat.name + '</button>';
  });
}

function setCategory(catId) {
  shopState.category = catId;
  document.querySelectorAll(".cat-pill").forEach(function(p) {
    p.classList.toggle("active", p.dataset.cat === catId);
  });
  renderProducts();
}

function renderFooterCatLinks() {
  var ul = document.getElementById("footer-cat-links");
  if (!ul) return;
  var cats = SBH.getCategories().filter(function(c) { return c.active; });
  ul.innerHTML = cats.map(function(c) {
    return '<li><a href="shop.html?cat=' + c.id + '">' + c.name + '</a></li>';
  }).join("") + '<li><a href="custom-cake.html">Custom Cake</a></li>';
}

// ── SEARCH ───────────────────────────────────────────────────────
function handleSearch(val) {
  shopState.search = val.trim().toLowerCase();
  var clearBtn = document.getElementById("search-clear");
  if (clearBtn) clearBtn.style.display = val ? "block" : "none";
  renderProducts();
}

function clearSearch() {
  var inp = document.getElementById("search-input");
  if (inp) inp.value = "";
  handleSearch("");
}

// ── SORT ─────────────────────────────────────────────────────────
function setSort(val) {
  shopState.sort = val;
  renderProducts();
}

// ── FILTERS ──────────────────────────────────────────────────────
function toggleFilter(name) {
  shopState.filters[name] = !shopState.filters[name];
  var btn = document.getElementById("filter-" + name);
  if (btn) btn.classList.toggle("active", shopState.filters[name]);
  renderProducts();
}

// ── RENDER ───────────────────────────────────────────────────────
function renderProducts() {
  var products = SBH.getProducts();
  var cats     = SBH.getCategories();

  // 1. Filter by category
  if (shopState.category !== "all") {
    products = products.filter(function(p) { return p.category === shopState.category; });
  }

  // 2. Filter by search
  if (shopState.search) {
    products = products.filter(function(p) {
      return p.name.toLowerCase().includes(shopState.search) ||
             p.desc.toLowerCase().includes(shopState.search) ||
             p.category.toLowerCase().includes(shopState.search);
    });
  }

  // 3. Filter chips
  if (shopState.filters.instock)     products = products.filter(function(p) { return p.status === "instock"; });
  if (shopState.filters.bestseller)  products = products.filter(function(p) { return p.bestSeller; });
  if (shopState.filters.newonly)     products = products.filter(function(p) { return p.isNew; });

  // 4. Sort
  var sorted = products.slice();
  switch (shopState.sort) {
    case "price-low":  sorted.sort(function(a,b) { return a.price - b.price; }); break;
    case "price-high": sorted.sort(function(a,b) { return b.price - a.price; }); break;
    case "name-az":    sorted.sort(function(a,b) { return a.name.localeCompare(b.name); }); break;
    case "name-za":    sorted.sort(function(a,b) { return b.name.localeCompare(a.name); }); break;
    case "popular":    sorted.sort(function(a,b) { return (b.bestSeller?1:0) - (a.bestSeller?1:0); }); break;
  }

  // 5. Render grid
  var grid = document.getElementById("products-grid");
  if (!grid) return;

  if (sorted.length === 0) {
    grid.innerHTML = '<div class="no-results">' +
      '<div class="no-results-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9B6340" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>' +
      '<h3>Nothing found</h3>' +
      '<p>Try a different search or remove some filters.</p>' +
      '<button class="btn btn-outline" onclick="resetAll()">Clear All Filters</button>' +
    '</div>';
  } else {
    grid.innerHTML = sorted.map(function(p) { return buildCard(p, cats); }).join("");
  }

  // 6. Results count
  var countEl = document.getElementById("results-count");
  if (countEl) countEl.textContent = sorted.length + " item" + (sorted.length !== 1 ? "s" : "") + " found";

  // 7. Active filter tags
  renderActiveTags();
}

function buildCard(product, cats) {
  var cat      = cats.find(function(c) { return c.id === product.category; });
  var catColor = cat ? cat.color : "#9B6340";
  var catName  = cat ? cat.name  : product.category;
  var soldout  = product.status !== "instock";
  var imgData  = SBH.getProductImage(product.id);

  var imgHtml = imgData
    ? '<img src="' + imgData + '" alt="' + product.name + '" loading="lazy" />'
    : buildPlaceholder(catColor, catName);

  return '<div class="product-card" onclick="openProductModal(' + product.id + ')">' +
    '<div class="product-img-wrap">' +
      imgHtml +
      '<div class="product-badges">' +
        (product.bestSeller && !soldout ? '<span class="badge badge-bestseller">Best Seller</span>' : "") +
        (product.isNew ? '<span class="badge badge-new">New</span>' : "") +
        (soldout ? '<span class="badge badge-soldout">Sold Out</span>' : "") +
      '</div>' +
    '</div>' +
    '<div class="product-body">' +
      '<span class="product-cat-badge" style="background:' + catColor + '">' + catName + '</span>' +
      '<div class="product-name">' + product.name + '</div>' +
      '<div class="product-desc">' + product.desc + '</div>' +
      '<div class="product-footer">' +
        '<span class="product-price">$' + product.price.toFixed(2) + '</span>' +
        (!soldout
          ? '<button class="btn btn-rose btn-sm" onclick="event.stopPropagation();quickAddToCart(' + product.id + ')">Add to Cart</button>'
          : '<button class="btn btn-outline btn-sm" disabled>Sold Out</button>'
        ) +
      '</div>' +
    '</div>' +
  '</div>';
}

function buildPlaceholder(color, name) {
  return '<div class="product-img-placeholder" style="background:' + hexToRgba(color, 0.08) + '">' +
    '<div class="placeholder-icon" style="background:' + hexToRgba(color, 0.15) + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="1.5" stroke-linecap="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>' +
    '</div>' +
    '<span class="placeholder-cat-label" style="color:' + color + '">' + name + '</span>' +
  '</div>';
}

function hexToRgba(hex, alpha) {
  var r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
}

function renderActiveTags() {
  var tags  = document.getElementById("active-filters");
  if (!tags) return;
  var items = [];
  if (shopState.search)           items.push({ label: 'Search: "' + shopState.search + '"', action: "clearSearch()" });
  if (shopState.category !== "all") {
    var cats = SBH.getCategories();
    var cat  = cats.find(function(c) { return c.id === shopState.category; });
    if (cat) items.push({ label: cat.name, action: "setCategory('all')" });
  }
  if (shopState.filters.instock)    items.push({ label: "In Stock Only", action: "toggleFilter('instock')" });
  if (shopState.filters.bestseller) items.push({ label: "Best Sellers",  action: "toggleFilter('bestseller')" });
  if (shopState.filters.newonly)    items.push({ label: "New",           action: "toggleFilter('newonly')" });

  tags.innerHTML = items.map(function(it) {
    return '<span class="active-filter-tag">' + it.label +
      '<button onclick="' + it.action + '; renderProducts()">&#10005;</button></span>';
  }).join("");
}

function resetAll() {
  shopState = { category:"all", sort:"default", search:"", filters:{ instock:false, bestseller:false, newonly:false } };
  var inp = document.getElementById("search-input");   if (inp) inp.value = "";
  var sel = document.getElementById("sort-select");    if (sel) sel.value = "default";
  var clr = document.getElementById("search-clear");   if (clr) clr.style.display = "none";
  ["instock","bestseller","new"].forEach(function(f) {
    var el = document.getElementById("filter-" + f); if (el) el.classList.remove("active");
  });
  document.querySelectorAll(".cat-pill").forEach(function(p) { p.classList.toggle("active", p.dataset.cat === "all"); });
  renderProducts();
}

// ── PRODUCT MODAL ────────────────────────────────────────────────
function openProductModal(productId) {
  var product  = SBH.getProducts().find(function(p) { return p.id === productId; });
  var cats     = SBH.getCategories();
  if (!product) return;
  var cat      = cats.find(function(c) { return c.id === product.category; });
  var catColor = cat ? cat.color : "#9B6340";
  var catName  = cat ? cat.name  : product.category;
  var soldout  = product.status !== "instock";
  var imgData  = SBH.getProductImage(product.id);

  var inner = document.getElementById("product-modal-inner");
  if (!inner) return;

  inner.innerHTML =
    '<button class="modal-close" onclick="closeOverlay(\'product-modal\')">&#10005;</button>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;">' +
      '<div style="border-radius:var(--radius-sm);overflow:hidden;height:260px;background:' + hexToRgba(catColor,0.08) + '">' +
        (imgData ? '<img src="' + imgData + '" style="width:100%;height:100%;object-fit:cover" />' : buildPlaceholder(catColor, catName)) +
      '</div>' +
      '<div style="padding:.5rem 0">' +
        '<span style="background:' + catColor + ';color:white;font-size:.68rem;font-weight:800;padding:.2rem .7rem;border-radius:4px;letter-spacing:.5px;text-transform:uppercase">' + catName + '</span>' +
        '<h2 style="font-family:Cormorant Garamond,serif;font-size:1.8rem;color:var(--brown-dark);margin:.6rem 0 .4rem;line-height:1.2">' + product.name + '</h2>' +
        '<div style="font-size:1.7rem;font-weight:800;color:var(--brown);margin-bottom:.8rem">$' + product.price.toFixed(2) + '</div>' +
        '<p style="color:var(--text-muted);font-size:.88rem;line-height:1.7;margin-bottom:.8rem">' + (product.longDesc || product.desc) + '</p>' +
        (product.allergens ? '<p style="font-size:.78rem;color:var(--text-muted);margin-bottom:.8rem">Allergens: ' + product.allergens + '</p>' : '') +
        (!soldout ? '<div style="display:flex;align-items:center;gap:.8rem;margin-bottom:1rem">' +
            '<div style="display:flex;align-items:center;border:1.5px solid var(--cream-dark);border-radius:8px;overflow:hidden">' +
              '<button onclick="modalQty(-1)" style="background:var(--cream);border:none;padding:.5rem .9rem;font-size:1.2rem;cursor:pointer;font-weight:700;color:var(--brown)">&#8722;</button>' +
              '<span id="modal-qty" style="padding:.5rem 1rem;font-weight:800;color:var(--brown-dark)">1</span>' +
              '<button onclick="modalQty(1)"  style="background:var(--cream);border:none;padding:.5rem .9rem;font-size:1.2rem;cursor:pointer;font-weight:700;color:var(--brown)">&#43;</button>' +
            '</div>' +
            '<span style="font-size:.85rem;color:var(--text-muted)">x $' + product.price.toFixed(2) + ' each</span>' +
          '</div>' +
          '<button class="btn btn-primary btn-block" onclick="modalAddToCart(' + product.id + ')">Add to Cart — $<span id="modal-total">' + product.price.toFixed(2) + '</span></button>'
          : '<button class="btn btn-outline btn-block" disabled>Currently Sold Out</button>') +
      '</div>' +
    '</div>';

  window._modalProductId = productId;
  window._modalPrice     = product.price;
  openOverlay("product-modal");
}

function modalQty(delta) {
  var el  = document.getElementById("modal-qty");
  var tot = document.getElementById("modal-total");
  if (!el) return;
  var qty = Math.max(1, parseInt(el.textContent) + delta);
  el.textContent  = qty;
  if (tot) tot.textContent = (window._modalPrice * qty).toFixed(2);
}

function modalAddToCart(productId) {
  var qty     = parseInt(document.getElementById("modal-qty")?.textContent || 1);
  var product = SBH.getProducts().find(function(p) { return p.id === productId; });
  if (!product) return;
  SBH.addToCart(product, qty);
  closeOverlay("product-modal");
  showToast(product.name + " added to cart!");
}

function quickAddToCart(productId) {
  var product = SBH.getProducts().find(function(p) { return p.id === productId; });
  if (!product || product.status !== "instock") return;
  SBH.addToCart(product, 1);
  showToast(product.name + " added to cart!");
}
