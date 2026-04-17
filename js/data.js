const SBH = {

  defaultProducts: [
    { id:1,  name:"Classic Chocolate Chip Cookies", category:"Cookies", price:14.99, emoji:"🍪", desc:"Buttery chewy cookies loaded with semi-sweet chocolate chips. Baked fresh daily.", longDesc:"Made with brown butter, premium chocolate chips, and just the right touch of sea salt. Crispy on the edges and gooey in the center.", bestSeller:true,  status:"instock", isNew:false, featured:true,  allergens:"Contains gluten, dairy, eggs" },
    { id:2,  name:"Snickerdoodle Dreams",           category:"Cookies", price:13.99, emoji:"🌀", desc:"Soft and pillowy cinnamon sugar cookies with perfectly crisp edges.",               longDesc:"Rolled generously in cinnamon sugar and baked until soft in the center.", bestSeller:false, status:"instock", isNew:true,  featured:false, allergens:"Contains gluten, dairy, eggs" },
    { id:3,  name:"Double Fudge Brownies",          category:"Cookies", price:16.99, emoji:"🟫", desc:"Rich dense fudge brownies with a signature crinkly top.",                           longDesc:"Two types of dark chocolate. Dense fudgy and intensely chocolatey.", bestSeller:true,  status:"instock", isNew:false, featured:false, allergens:"Contains gluten, dairy, eggs" },
    { id:4,  name:"Strawberry Shortcake",           category:"Cakes",   price:42.99, emoji:"🍓", desc:"Layers of fluffy vanilla sponge fresh strawberries and whipped cream frosting.",    longDesc:"Three layers of light vanilla sponge filled with fresh macerated strawberries.", bestSeller:true,  status:"instock", isNew:false, featured:true,  allergens:"Contains gluten, dairy, eggs" },
    { id:5,  name:"Red Velvet Celebration Cake",    category:"Cakes",   price:55.99, emoji:"❤️", desc:"Moist velvety red cake layers with classic cream cheese frosting.",                 longDesc:"Deep red velvet layers with a hint of cocoa and silky cream cheese frosting.", bestSeller:true,  status:"instock", isNew:false, featured:true,  allergens:"Contains gluten, dairy, eggs" },
    { id:6,  name:"Lemon Drizzle Loaf",             category:"Cakes",   price:28.99, emoji:"🍋", desc:"Zesty lemon sponge drenched in tangy sugar glaze.",                                longDesc:"Using fresh lemons this loaf packs a serious citrus punch.", bestSeller:false, status:"instock", isNew:true,  featured:false, allergens:"Contains gluten, dairy, eggs" },
    { id:7,  name:"Blueberry Muffins",              category:"Bakery",  price:10.99, emoji:"🫐", desc:"Tender muffins bursting with fresh blueberries topped with a crunchy brown sugar crumble.", longDesc:"Jumbo sized muffins with a towering top and pockets of fresh blueberries.", bestSeller:true,  status:"instock", isNew:false, featured:true,  allergens:"Contains gluten, dairy, eggs" },
    { id:8,  name:"Cinnamon Roll",                  category:"Bakery",  price:5.99,  emoji:"🥐", desc:"Fluffy gooey cinnamon rolls drizzled with cream cheese frosting.",                  longDesc:"Pillowy soft dough swirled with cinnamon brown sugar filling.", bestSeller:false, status:"soldout",  isNew:false, featured:false, allergens:"Contains gluten, dairy, eggs" },
    { id:9,  name:"Artisan Sourdough",              category:"Bakery",  price:8.99,  emoji:"🍞", desc:"72 hour fermented artisan sourdough with a crackling golden crust.",                longDesc:"Our sourdough uses slow fermentation for complex flavor.", bestSeller:false, status:"instock", isNew:false, featured:false, allergens:"Contains gluten" },
    { id:10, name:"Sugar Cookies Decorated",        category:"Cookies", price:18.99, emoji:"⭐", desc:"Hand decorated sugar cookies with intricate royal icing.",                          longDesc:"Each cookie is hand piped with royal icing in seasonal designs.", bestSeller:false, status:"instock", isNew:true,  featured:false, allergens:"Contains gluten, dairy, eggs" },
    { id:11, name:"Chocolate Fudge Cake",           category:"Cakes",   price:48.99, emoji:"🎂", desc:"Three layers of decadent dark chocolate sponge with silky ganache frosting.",       longDesc:"Three rich dark chocolate sponge layers filled and frosted with velvety ganache.", bestSeller:false, status:"instock", isNew:false, featured:false, allergens:"Contains gluten, dairy, eggs" },
    { id:12, name:"Banana Nut Bread",               category:"Bakery",  price:9.99,  emoji:"🍌", desc:"Perfectly moist warmly spiced banana bread with toasted walnuts.",                  longDesc:"Made with overripe bananas for maximum sweetness and toasted walnuts.", bestSeller:false, status:"instock", isNew:false, featured:false, allergens:"Contains gluten, dairy, eggs, tree nuts" }
  ],

  cakeOptions: {
    sizes: [
      { value:"6-inch",     label:"6 inch Round  Serves 8 to 10" },
      { value:"8-inch",     label:"8 inch Round  Serves 12 to 15" },
      { value:"10-inch",    label:"10 inch Round  Serves 20 to 25" },
      { value:"12-inch",    label:"12 inch Round  Serves 30 to 35" },
      { value:"half-sheet", label:"Half Sheet  Serves 40 to 50" },
      { value:"tiered-2",   label:"2 Tier  Serves 50 to 75" },
      { value:"tiered-3",   label:"3 Tier  Serves 80 to 120" }
    ],
    flavors:   ["Vanilla","Chocolate","Red Velvet","Lemon","Strawberry","Funfetti","Carrot","Coconut","Marble","Almond"],
    frostings: ["Buttercream","Cream Cheese","Whipped Cream","Ganache","Fondant"],
    fillings:  ["None","Buttercream","Lemon Curd","Strawberry Jam","Chocolate Ganache","Fresh Fruit","Custard"],
    addons:    ["Fresh Flowers","Gold Leaf Accents","Edible Image","Figurines","Drip Effect","Sprinkles and Confetti","Fruit Topping"]
  },

  defaultSettings: {
    cakesEnabled:        true,
    emailsEnabled:       true,
    deliveryRadius:      "30",
    deliveryFee:         "8.99",
    pickupAddress:       "721 Fallsgrove Dr, Rockville, MD 20850",
    pickupLat:           39.0840,
    pickupLng:           -77.1528,
    squareLink:          "",
    doordashLink:        "",
    instagramLink:       "",
    facebookLink:        "",
    tiktokLink:          "",
    twitterLink:         "",
    googleReviewLink:    "",
    cashappLink:         "",
    emailjsServiceId:    "",
    emailjsTemplateId:   "",
    emailjsPublicKey:    "",
    smsNotifyNumber:     "",
    pickupStartHour:     9,
    pickupEndHour:       18,
    pickupDays:          [1,2,3,4,5,6],
    cakeLeadDays:        2,
  },

  // ── BLOCKED DATES ────────────────────────────────────────────────
  getBlockedDates() {
    try { const s = localStorage.getItem("sbh_blocked_dates"); return s ? JSON.parse(s) : []; }
    catch { return []; }
  },
  saveBlockedDates(dates) {
    try { localStorage.setItem("sbh_blocked_dates", JSON.stringify(dates)); } catch {}
  },
  addBlockedDate(dateStr) {
    const dates = this.getBlockedDates();
    if (!dates.includes(dateStr)) { dates.push(dateStr); this.saveBlockedDates(dates); }
  },
  removeBlockedDate(dateStr) {
    const dates = this.getBlockedDates().filter(d => d !== dateStr);
    this.saveBlockedDates(dates);
  },
  isDateBlocked(dateStr) {
    return this.getBlockedDates().includes(dateStr);
  },

  // ── PRODUCTS ─────────────────────────────────────────────────────
  getProducts() {
    try { const s = localStorage.getItem("sbh_products"); return s ? JSON.parse(s) : this.defaultProducts; }
    catch { return this.defaultProducts; }
  },
  saveProducts(p) { try { localStorage.setItem("sbh_products", JSON.stringify(p)); } catch {} },

  // ── CART ─────────────────────────────────────────────────────────
  getCart() {
    try { const s = localStorage.getItem("sbh_cart"); return s ? JSON.parse(s) : []; }
    catch { return []; }
  },
  saveCart(c) { try { localStorage.setItem("sbh_cart", JSON.stringify(c)); } catch {} this.updateCartBadge(); },
  addToCart(product, qty = 1) {
    const cart = this.getCart();
    const idx  = cart.findIndex(i => i.id === product.id);
    if (idx > -1) { cart[idx].qty += qty; }
    else { cart.push({ id: product.id, name: product.name, price: product.price, emoji: product.emoji, qty }); }
    this.saveCart(cart); return cart;
  },
  removeFromCart(id)     { const c = this.getCart().filter(i => i.id !== id); this.saveCart(c); return c; },
  updateCartQty(id, qty) { if (qty <= 0) return this.removeFromCart(id); const c = this.getCart().map(i => i.id === id ? {...i, qty} : i); this.saveCart(c); return c; },
  clearCart()            { this.saveCart([]); },
  getCartCount()         { return this.getCart().reduce((s,i) => s + i.qty, 0); },
  getCartTotal() {
    const products = this.getProducts();
    return this.getCart().reduce((s, item) => {
      const p = products.find(p => p.id === item.id);
      return s + (p ? p.price : item.price) * item.qty;
    }, 0);
  },
  updateCartBadge() {
    const badge = document.getElementById("cart-badge");
    const count = this.getCartCount();
    if (badge) { badge.textContent = count; badge.style.display = count > 0 ? "flex" : "none"; }
  },

  // ── USER ─────────────────────────────────────────────────────────
  getUser()   { try { const s = localStorage.getItem("sbh_user"); return s ? JSON.parse(s) : null; } catch { return null; } },
  saveUser(u) { try { localStorage.setItem("sbh_user", JSON.stringify(u)); } catch {} },
  logout()    { try { localStorage.removeItem("sbh_user"); } catch {} },

  // ── SETTINGS ─────────────────────────────────────────────────────
  getSettings() {
    try { const s = localStorage.getItem("sbh_settings"); return s ? {...this.defaultSettings, ...JSON.parse(s)} : {...this.defaultSettings}; }
    catch { return {...this.defaultSettings}; }
  },
  saveSettings(s) { try { localStorage.setItem("sbh_settings", JSON.stringify(s)); } catch {} },

  // ── ORDERS ───────────────────────────────────────────────────────
  getOrders()     { try { const s = localStorage.getItem("sbh_orders"); return s ? JSON.parse(s) : []; } catch { return []; } },
  saveOrders(o)   { try { localStorage.setItem("sbh_orders", JSON.stringify(o)); } catch {} },
  getOrderById(id){ return this.getOrders().find(o => o.id === id) || null; },
  updateOrder(id, changes) {
    const orders = this.getOrders().map(o => o.id === id ? {...o, ...changes} : o);
    this.saveOrders(orders);
    return orders.find(o => o.id === id);
  },

  // ── CAKE REQUESTS ────────────────────────────────────────────────
  getCakeRequests() { try { const s = localStorage.getItem("sbh_cake_requests"); return s ? JSON.parse(s) : []; } catch { return []; } },
  saveCakeRequest(r) {
    const reqs = this.getCakeRequests();
    reqs.unshift(r);
    try { localStorage.setItem("sbh_cake_requests", JSON.stringify(reqs)); } catch {}
  },
  updateCakeRequest(id, changes) {
    const reqs = this.getCakeRequests().map(r => r.id === id ? {...r, ...changes} : r);
    try { localStorage.setItem("sbh_cake_requests", JSON.stringify(reqs)); } catch {}
  },

  // ── ADMIN USERS ──────────────────────────────────────────────────
  getAdminUsers() {
    try {
      const s = localStorage.getItem("sbh_admin_users");
      if (s) return JSON.parse(s);
      const defaults = [{ id:"1", name:"Selina Chimukangara", email:"sellybakehouse@gmail.com", password:"SellyBakes2025!", role:"master", createdAt:"2025-01-01" }];
      localStorage.setItem("sbh_admin_users", JSON.stringify(defaults));
      return defaults;
    } catch { return []; }
  },
  saveAdminUsers(users) { try { localStorage.setItem("sbh_admin_users", JSON.stringify(users)); } catch {} },
  addAdminUser(user) {
    const users = this.getAdminUsers();
    users.push({...user, id: Date.now().toString(), createdAt: new Date().toLocaleDateString()});
    this.saveAdminUsers(users);
  },
  deleteAdminUser(id) { this.saveAdminUsers(this.getAdminUsers().filter(u => u.id !== id)); },
  getAdminSession()   { try { const s = localStorage.getItem("sbh_admin_session"); return s ? JSON.parse(s) : null; } catch { return null; } },
  setAdminSession(u)  { try { localStorage.setItem("sbh_admin_session", JSON.stringify({id:u.id, name:u.name, email:u.email, role:u.role})); } catch {} },
  clearAdminSession() { try { localStorage.removeItem("sbh_admin_session"); } catch {} },
  adminLogin(email, password) {
    const user = this.getAdminUsers().find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) { this.setAdminSession(user); return user; }
    return null;
  },

  // ── BEST SELLERS ─────────────────────────────────────────────────
  getBestSellers(category = null, limit = 4) {
    let p = this.getProducts().filter(p => p.bestSeller && p.status === "instock");
    if (category) p = p.filter(p => p.category === category);
    return p.slice(0, limit);
  },
  getBestSellersByCategory(limit = 3) {
    return { Cookies: this.getBestSellers("Cookies",limit), Cakes: this.getBestSellers("Cakes",limit), Bakery: this.getBestSellers("Bakery",limit) };
  },

  // ── TIME SLOT GENERATOR ──────────────────────────────────────────
  generateTimeSlots(startHour, endHour) {
    const slots = [];
    for (let h = startHour; h < endHour; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hh   = h % 12 === 0 ? 12 : h % 12;
        const mm   = m === 0 ? "00" : "30";
        const ampm = h < 12 ? "AM" : "PM";
        slots.push(`${hh}:${mm} ${ampm}`);
      }
    }
    return slots;
  },

  // ── INVOICE GENERATOR ────────────────────────────────────────────
  generateInvoice(order) {
    const settings = this.getSettings();
    const products = this.getProducts();
    const items    = Array.isArray(order.itemDetails)
      ? order.itemDetails
      : (order.items || "").split(", ").map(i => ({ name: i, price: 0, qty: 1 }));

    const tipAmount      = parseFloat(order.tip || 0);
    const deliveryAmount = order.method === "delivery" ? parseFloat(settings.deliveryFee) : 0;
    const subtotal       = parseFloat(order.subtotal || order.total) || 0;
    const tax            = parseFloat(order.tax || 0);
    const total          = parseFloat(order.total || 0);

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${order.id} — Selly Bake House</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; color: #3E1C07; }
    .header { background: #3E1C07; color: #F0C060; padding: 30px; border-radius: 12px 12px 0 0; }
    .header h1 { margin: 0; font-size: 28px; } .header p { margin: 4px 0 0; opacity: .7; font-size: 14px; }
    .body { border: 1px solid #EDD9BC; border-top: none; padding: 30px; border-radius: 0 0 12px 12px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #F7E8D4; font-size: 14px; }
    .row.total { font-weight: bold; font-size: 16px; border-bottom: none; border-top: 2px solid #EDD9BC; margin-top: 8px; padding-top: 12px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; font-size: 14px; }
    .info-block { background: #FFF6EC; padding: 14px; border-radius: 8px; }
    .info-block h4 { margin: 0 0 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #9B6340; }
    .badge { display: inline-block; background: #D1FAE5; color: #1E6B45; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; }
    .footer { text-align: center; color: #9B6340; font-size: 12px; margin-top: 30px; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>Selly Bake House</h1>
    <p>Home of Everything Toothsome  |  Rockville, MD  |  (301) 356-1232</p>
  </div>
  <div class="body">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
      <div><h2 style="margin:0;font-size:22px;">Invoice</h2><p style="margin:4px 0;color:#9B6340;font-size:14px;">#${order.id}</p></div>
      <div style="text-align:right;font-size:13px;color:#9B6340;"><div>${order.date || new Date().toLocaleDateString()}</div><span class="badge">${order.status || "pending"}</span></div>
    </div>
    <div class="info-grid">
      <div class="info-block"><h4>Bill To</h4><strong>${order.customer || "Customer"}</strong><br>${order.email || ""}<br>${order.phone || ""}</div>
      <div class="info-block"><h4>Fulfillment</h4><strong>${order.method === "delivery" ? "Delivery" : "Pickup"}</strong><br>${order.method === "delivery" ? (order.deliveryAddress || "") : (settings.pickupAddress || "721 Fallsgrove Dr, Rockville MD")}<br>${order.pickupDate ? order.pickupDate + " at " + (order.pickupTime || "") : ""}</div>
    </div>
    <div style="margin:20px 0;">
      <div style="background:#F7E8D4;padding:10px 16px;border-radius:8px 8px 0 0;font-size:12px;font-weight:bold;color:#9B6340;text-transform:uppercase;letter-spacing:1px;">Items Ordered</div>
      ${items.map(i => `<div class="row"><span>${i.name || i}</span><span>${i.price ? "$" + parseFloat(i.price).toFixed(2) : ""}</span></div>`).join("")}
    </div>
    <div style="margin-top:16px;">
      <div class="row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
      ${deliveryAmount > 0 ? `<div class="row"><span>Delivery Fee</span><span>$${deliveryAmount.toFixed(2)}</span></div>` : ""}
      ${tax > 0 ? `<div class="row"><span>MD Tax (6%)</span><span>$${tax.toFixed(2)}</span></div>` : ""}
      ${tipAmount > 0 ? `<div class="row"><span>Tip</span><span>$${tipAmount.toFixed(2)}</span></div>` : ""}
      <div class="row total"><span>TOTAL</span><span>$${total.toFixed(2)}</span></div>
    </div>
    ${order.paymentMethod ? `<div style="margin-top:16px;font-size:13px;color:#9B6340;">Payment method: <strong style="color:#3E1C07;">${order.paymentMethod}</strong></div>` : ""}
  </div>
  <div class="footer">
    <p>Thank you for your order! We hope to see you again soon.</p>
    <p>Questions? Call (301) 356-1232 or email sellybakehouse@gmail.com</p>
    <p>sellybakehouse.com</p>
  </div>
  <div style="text-align:center;margin-top:20px;">
    <button onclick="window.print()" style="background:#3E1C07;color:#F0C060;border:none;padding:12px 28px;border-radius:50px;font-size:14px;font-weight:bold;cursor:pointer;">🖨️ Print Invoice</button>
  </div>
</body>
</html>`;
  }
};
