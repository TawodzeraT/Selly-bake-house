// ================================================================
// SELLY BAKE HOUSE — SUPABASE DATABASE CONNECTION
// Plain HTML version — no npm, no Next.js, no packages needed
// Replace the two lines below with your real Supabase details
// ================================================================

var SUPABASE_URL = "https://ucmsmprayzxijfykvnrd.supabase.co";
var SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjbXNtcHJheXp4aWpmeWt2bnJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NTk3NzIsImV4cCI6MjA5MjUzNTc3Mn0.AlWVY-rB8ehRCcMiG3875bZXTru_NyakUKL3NgS2LZM";

var DB = {

  // ── CORE FETCH HELPER ─────────────────────────────────────────
  async req(table, method, body, filter, extra) {
    var url = SUPABASE_URL + "/rest/v1/" + table;
    if (filter) url += "?" + filter;
    var opts = {
      method:  method || "GET",
      headers: {
        "Content-Type":  "application/json",
        "apikey":        SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY,
        "Prefer":        method === "POST" ? "return=representation" : "return=minimal"
      }
    };
    if (body) opts.body = JSON.stringify(body);
    try {
      var res  = await fetch(url, opts);
      var text = await res.text();
      return text ? JSON.parse(text) : null;
    } catch (e) {
      console.warn("DB error on " + table + ":", e);
      return null;
    }
  },

  // ── PRODUCTS ──────────────────────────────────────────────────
  async getProducts() {
    var data = await this.req("products", "GET", null, "order=id.asc");
    if (!data || !Array.isArray(data) || data.length === 0) return SBH.defaultProducts;
    return data.map(function(p) {
      return {
        id:          p.id,
        name:        p.name,
        category:    p.category,
        price:       parseFloat(p.price),
        desc:        p.description   || "",
        longDesc:    p.long_desc     || p.description || "",
        status:      p.status        || "instock",
        bestSeller:  p.best_seller   || false,
        isNew:       p.is_new        || false,
        featured:    p.featured      || false,
        allergens:   p.allergens     || "",
        image:       p.image_data    || ""
      };
    });
  },

  async saveProduct(product) {
    var row = {
      name:        product.name,
      category:    product.category,
      price:       product.price,
      description: product.desc,
      long_desc:   product.longDesc,
      status:      product.status,
      best_seller: product.bestSeller,
      is_new:      product.isNew,
      featured:    product.featured,
      allergens:   product.allergens || ""
    };
    var existing = await this.req("products", "GET", null, "id=eq." + product.id);
    if (existing && existing.length > 0) {
      return await this.req("products", "PATCH", row, "id=eq." + product.id);
    } else {
      return await this.req("products", "POST", row);
    }
  },

  async updateProductStatus(id, status) {
    return await this.req("products", "PATCH", { status }, "id=eq." + id);
  },

  async saveProductImage(productId, imageData) {
    return await this.req("products", "PATCH", { image_data: imageData }, "id=eq." + productId);
  },

  async deleteProductImage(productId) {
    return await this.req("products", "PATCH", { image_data: "" }, "id=eq." + productId);
  },

  // ── ORDERS ────────────────────────────────────────────────────
  async getOrders() {
    var data = await this.req("orders", "GET", null, "order=created_at.desc");
    return data || [];
  },

  async saveOrder(order) {
    return await this.req("orders", "POST", {
      id:                   order.id,
      customer:             order.customer,
      email:                order.email     || "",
      phone:                order.phone     || "",
      items:                order.items     || "",
      subtotal:             order.subtotal  || 0,
      tax:                  order.tax       || 0,
      tip:                  order.tip       || 0,
      total:                order.total     || 0,
      status:               order.status    || "pending",
      method:               order.method    || "pickup",
      payment_method:       order.paymentMethod   || "square",
      pickup_date:          order.pickupDate      || "",
      pickup_time:          order.pickupTime      || "",
      delivery_date:        order.deliveryDate    || "",
      delivery_time:        order.deliveryTime    || "",
      delivery_address:     order.deliveryAddress || "",
      delivery_instructions:order.deliveryInstructions || ""
    });
  },

  async updateOrderStatus(id, status) {
    return await this.req("orders", "PATCH", { status }, "id=eq." + id);
  },

  async getOrderById(id) {
    var data = await this.req("orders", "GET", null, "id=eq." + id);
    return data && data[0] ? data[0] : null;
  },

  // ── CAKE REQUESTS ─────────────────────────────────────────────
  async getCakeRequests() {
    var data = await this.req("cake_requests", "GET", null, "order=submitted_at.desc");
    return data || [];
  },

  async saveCakeRequest(req) {
    return await this.req("cake_requests", "POST", {
      id:          req.id,
      name:        req.name,
      email:       req.email   || "",
      phone:       req.phone   || "",
      size:        req.size    || "",
      flavor:      req.flavor  || "",
      frosting:    req.frosting|| "",
      filling:     req.filling || "",
      addons:      Array.isArray(req.addons) ? req.addons.join(", ") : "",
      design:      req.design  || "",
      date_needed: req.date    || "",
      method:      req.method  || "pickup",
      notes:       req.notes   || "",
      status:      "pending"
    });
  },

  async updateCakeRequest(id, status) {
    return await this.req("cake_requests", "PATCH", { status }, "id=eq." + id);
  },

  // ── BLOCKED DATES ─────────────────────────────────────────────
  async getBlockedDates() {
    var data = await this.req("blocked_dates", "GET");
    if (!data || !Array.isArray(data)) return [];
    return data.map(function(d) { return d.date_str; });
  },

  async addBlockedDate(dateStr) {
    return await this.req("blocked_dates", "POST", { date_str: dateStr });
  },

  async removeBlockedDate(dateStr) {
    return await this.req("blocked_dates", "DELETE", null, "date_str=eq." + dateStr);
  },

  // ── CATEGORIES ────────────────────────────────────────────────
  async getCategories() {
    var data = await this.req("categories", "GET", null, "order=display_order.asc");
    if (!data || !Array.isArray(data) || data.length === 0) return SBH.defaultCategories;
    return data.map(function(c) {
      return { id: c.id, name: c.name, color: c.color, order: c.display_order, active: c.active };
    });
  },

  async saveCategory(cat) {
    var existing = await this.req("categories", "GET", null, "id=eq." + cat.id);
    var row = { id: cat.id, name: cat.name, color: cat.color, display_order: cat.order, active: cat.active };
    if (existing && existing.length > 0) {
      return await this.req("categories", "PATCH", row, "id=eq." + cat.id);
    } else {
      return await this.req("categories", "POST", row);
    }
  },

  async deleteCategory(id) {
    return await this.req("categories", "DELETE", null, "id=eq." + id);
  },

  // ── SETTINGS ──────────────────────────────────────────────────
  async getSettings() {
    var data = await this.req("settings", "GET");
    if (!data || !Array.isArray(data)) return {};
    var result = {};
    data.forEach(function(s) {
      try { result[s.key] = JSON.parse(s.value); }
      catch { result[s.key] = s.value; }
    });
    return result;
  },

  async saveSetting(key, value) {
    var existing = await this.req("settings", "GET", null, "key=eq." + key);
    var val      = JSON.stringify(value);
    if (existing && existing.length > 0) {
      return await this.req("settings", "PATCH", { value: val }, "key=eq." + key);
    } else {
      return await this.req("settings", "POST", { key, value: val });
    }
  },

  // ── FEEDBACK ──────────────────────────────────────────────────
  async saveFeedback(feedback) {
    return await this.req("feedback", "POST", {
      order_id: feedback.id       || "",
      customer: feedback.customer || "",
      email:    feedback.email    || "",
      rating:   feedback.rating   || 5,
      message:  feedback.text     || ""
    });
  },

  async getFeedback() {
    var data = await this.req("feedback", "GET", null, "order=created_at.desc");
    return data || [];
  },

  // ── SEED DEFAULT PRODUCTS ─────────────────────────────────────
  // Run this once from the browser console to copy your products to Supabase:
  // DB.seedProducts()
  async seedProducts() {
    console.log("Seeding products to Supabase...");
    for (var i = 0; i < SBH.defaultProducts.length; i++) {
      var p   = SBH.defaultProducts[i];
      var res = await this.saveProduct(p);
      console.log("Saved: " + p.name);
    }
    console.log("Done! All products are now in Supabase.");
  },

  // ── SEED DEFAULT CATEGORIES ───────────────────────────────────
  // Run this once: DB.seedCategories()
  async seedCategories() {
    console.log("Seeding categories...");
    for (var i = 0; i < SBH.defaultCategories.length; i++) {
      await this.saveCategory(SBH.defaultCategories[i]);
      console.log("Saved: " + SBH.defaultCategories[i].name);
    }
    console.log("Done!");
  }
};
