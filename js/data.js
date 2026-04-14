// ================================
// SELLY BAKE HOUSE — DATA LAYER
// Handles products, cart, and user
// state using localStorage.
// ================================

const SBH = {

  // ------ PRODUCTS ------
  defaultProducts: [
    {
      id: 1,
      name: "Classic Chocolate Chip Cookies",
      category: "Cookies",
      price: 14.99,
      emoji: "🍪",
      desc: "Buttery, chewy cookies loaded with semi-sweet chocolate chips. Baked fresh daily. Sold by the dozen.",
      longDesc: "Made with brown butter, premium Ghirardelli chips, and just the right touch of sea salt, these cookies are crispy on the edges and gooey in the center. Each dozen is packed with love and baked to order.",
      bestSeller: true,
      status: "instock",
      isNew: false,
      featured: true,
      allergens: "Contains gluten, dairy, eggs"
    },
    {
      id: 2,
      name: "Snickerdoodle Dreams",
      category: "Cookies",
      price: 13.99,
      emoji: "🌀",
      desc: "Soft and pillowy cinnamon-sugar cookies with perfectly crisp edges. A timeless classic.",
      longDesc: "Our snickerdoodles are rolled generously in cinnamon sugar and baked until soft in the center with slightly crisp, crinkled edges. Comfort in every bite.",
      bestSeller: false,
      status: "instock",
      isNew: true,
      featured: false,
      allergens: "Contains gluten, dairy, eggs"
    },
    {
      id: 3,
      name: "Double Fudge Brownies",
      category: "Cookies",
      price: 16.99,
      emoji: "🟫",
      desc: "Rich, dense fudge brownies with a signature crinkly top. Dark chocolate heaven.",
      longDesc: "Two types of dark chocolate go into these brownies — melted for the batter and chips folded in. Dense, fudgy, and intensely chocolatey with that classic shiny top.",
      bestSeller: true,
      status: "instock",
      isNew: false,
      featured: false,
      allergens: "Contains gluten, dairy, eggs"
    },
    {
      id: 4,
      name: "Strawberry Shortcake",
      category: "Cakes",
      price: 42.99,
      emoji: "🍓",
      desc: "Layers of fluffy vanilla sponge, fresh strawberries, and whipped cream frosting. A warm-weather favorite.",
      longDesc: "Three layers of light vanilla sponge filled with fresh macerated strawberries and house-made whipped cream. Finished with whole strawberries on top for a stunning presentation.",
      bestSeller: true,
      status: "instock",
      isNew: false,
      featured: true,
      allergens: "Contains gluten, dairy, eggs"
    },
    {
      id: 5,
      name: "Red Velvet Celebration Cake",
      category: "Cakes",
      price: 55.99,
      emoji: "❤️",
      desc: "Moist, velvety red cake layers with classic cream cheese frosting. Perfect for any occasion.",
      longDesc: "A showstopper. Deep red velvet layers with a hint of cocoa, sandwiched between generous layers of silky cream cheese frosting. Elegantly decorated and impossible to resist.",
      bestSeller: true,
      status: "instock",
      isNew: false,
      featured: true,
      allergens: "Contains gluten, dairy, eggs"
    },
    {
      id: 6,
      name: "Lemon Drizzle Loaf",
      category: "Cakes",
      price: 28.99,
      emoji: "🍋",
      desc: "Zesty lemon sponge drenched in tangy sugar glaze. Light, refreshing, utterly irresistible.",
      longDesc: "Using fresh Maryland lemons, this loaf packs a serious citrus punch. The lemon curd filling and drizzle glaze make every slice burst with flavour.",
      bestSeller: false,
      status: "instock",
      isNew: true,
      featured: false,
      allergens: "Contains gluten, dairy, eggs"
    },
    {
      id: 7,
      name: "Blueberry Muffins",
      category: "Bakery",
      price: 10.99,
      emoji: "🫐",
      desc: "Tender muffins bursting with fresh blueberries and topped with a crunchy brown sugar crumble.",
      longDesc: "Jumbo-sized muffins with a towering top and pockets of fresh blueberries throughout. The brown sugar crumble on top adds just the right crunch to contrast the soft, moist crumb.",
      bestSeller: true,
      status: "instock",
      isNew: false,
      featured: true,
      allergens: "Contains gluten, dairy, eggs"
    },
    {
      id: 8,
      name: "Cinnamon Roll",
      category: "Bakery",
      price: 5.99,
      emoji: "🥐",
      desc: "Fluffy, gooey cinnamon rolls drizzled with cream cheese frosting. A morning classic.",
      longDesc: "Pillowy soft dough swirled with cinnamon-brown sugar filling and finished with a thick cream cheese drizzle. Best enjoyed warm.",
      bestSeller: false,
      status: "soldout",
      isNew: false,
      featured: false,
      allergens: "Contains gluten, dairy, eggs"
    },
    {
      id: 9,
      name: "Artisan Sourdough",
      category: "Bakery",
      price: 8.99,
      emoji: "🍞",
      desc: "72-hour fermented artisan sourdough with a crackling golden crust and open, airy crumb.",
      longDesc: "Our sourdough uses a 5-year-old starter and slow fermentation for complex flavor. The crust crackles beautifully and the crumb is open and chewy. Baked fresh each morning.",
      bestSeller: false,
      status: "instock",
      isNew: false,
      featured: false,
      allergens: "Contains gluten"
    },
    {
      id: 10,
      name: "Sugar Cookies (Decorated)",
      category: "Cookies",
      price: 18.99,
      emoji: "⭐",
      desc: "Hand-decorated sugar cookies with intricate royal icing. Custom shapes available for events.",
      longDesc: "Each cookie is hand-piped with royal icing in seasonal designs. Available in custom shapes and colors for weddings, birthdays, baby showers, and holidays. Contact us for bulk event orders.",
      bestSeller: false,
      status: "instock",
      isNew: true,
      featured: false,
      allergens: "Contains gluten, dairy, eggs"
    },
    {
      id: 11,
      name: "Chocolate Fudge Cake",
      category: "Cakes",
      price: 48.99,
      emoji: "🎂",
      desc: "Three layers of decadent dark chocolate sponge with silky ganache frosting. For the true chocoholic.",
      longDesc: "Three rich dark-chocolate sponge layers, filled and frosted with a velvety dark chocolate ganache. Finished with chocolate shavings. Intensely indulgent.",
      bestSeller: false,
      status: "instock",
      isNew: false,
      featured: false,
      allergens: "Contains gluten, dairy, eggs"
    },
    {
      id: 12,
      name: "Banana Nut Bread",
      category: "Bakery",
      price: 9.99,
      emoji: "🍌",
      desc: "Perfectly moist, warmly-spiced banana bread with toasted walnuts. Comfort food at its finest.",
      longDesc: "Made with overripe bananas for maximum sweetness, warm cinnamon and nutmeg, and toasted walnuts throughout. A thick golden crust gives way to a pillowy, tender crumb.",
      bestSeller: false,
      status: "instock",
      isNew: false,
      featured: false,
      allergens: "Contains gluten, dairy, eggs, tree nuts"
    }
  ],

  // ------ CATEGORIES ------
  categories: [
    { id: "Cookies", label: "Cookies", emoji: "🍪", desc: "Baked fresh daily — over 8 varieties" },
    { id: "Cakes",   label: "Cakes",   emoji: "🎂", desc: "Whole cakes for every celebration" },
    { id: "Bakery",  label: "Bakery",  emoji: "🍞", desc: "Breads, muffins & morning favorites" }
  ],

  // ------ CAKE OPTIONS ------
  cakeOptions: {
    sizes: [
      { value: "6-inch",    label: '6" Round — Serves 8–10' },
      { value: "8-inch",    label: '8" Round — Serves 12–15' },
      { value: "10-inch",   label: '10" Round — Serves 20–25' },
      { value: "12-inch",   label: '12" Round — Serves 30–35' },
      { value: "half-sheet",label: 'Half Sheet — Serves 40–50' },
      { value: "tiered-2",  label: '2-Tier — Serves 50–75' },
      { value: "tiered-3",  label: '3-Tier — Serves 80–120' }
    ],
    flavors: [
      "Vanilla", "Chocolate", "Red Velvet", "Lemon", "Strawberry",
      "Funfetti", "Carrot", "Coconut", "Marble", "Almond"
    ],
    frostings: [
      "Buttercream", "Cream Cheese", "Whipped Cream", "Ganache", "Fondant"
    ],
    fillings: [
      "None", "Buttercream", "Lemon Curd", "Strawberry Jam", "Chocolate Ganache",
      "Fresh Fruit", "Custard"
    ],
    addons: [
      "Fresh Flowers", "Gold Leaf Accents", "Edible Image", "Figurines",
      "Drip Effect", "Sprinkles & Confetti", "Fruit Topping"
    ]
  },

  // ------ SETTINGS ------
  defaultSettings: {
    cakesEnabled: true,
    emailsEnabled: true,
    deliveryRadius: "30",
    deliveryFee: "8.99",
    pickupAddress: "721 Fallsgrove Dr, Rockville, MD 20850"
  },

  // ------ STORAGE HELPERS ------
  getProducts() {
    try {
      const stored = localStorage.getItem("sbh_products");
      return stored ? JSON.parse(stored) : this.defaultProducts;
    } catch { return this.defaultProducts; }
  },

  saveProducts(products) {
    try { localStorage.setItem("sbh_products", JSON.stringify(products)); } catch {}
  },

  getCart() {
    try {
      const stored = localStorage.getItem("sbh_cart");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  },

  saveCart(cart) {
    try { localStorage.setItem("sbh_cart", JSON.stringify(cart)); } catch {}
    this.updateCartBadge();
  },

  getUser() {
    try {
      const stored = localStorage.getItem("sbh_user");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  },

  saveUser(user) {
    try { localStorage.setItem("sbh_user", JSON.stringify(user)); } catch {}
  },

  logout() {
    try { localStorage.removeItem("sbh_user"); } catch {}
  },

  getSettings() {
    try {
      const stored = localStorage.getItem("sbh_settings");
      return stored ? { ...this.defaultSettings, ...JSON.parse(stored) } : { ...this.defaultSettings };
    } catch { return { ...this.defaultSettings }; }
  },

  saveSettings(settings) {
    try { localStorage.setItem("sbh_settings", JSON.stringify(settings)); } catch {}
  },

  getOrders() {
    try {
      const stored = localStorage.getItem("sbh_orders");
      return stored ? JSON.parse(stored) : this.mockOrders;
    } catch { return this.mockOrders; }
  },

  saveOrders(orders) {
    try { localStorage.setItem("sbh_orders", JSON.stringify(orders)); } catch {}
  },

  getCakeRequests() {
    try {
      const stored = localStorage.getItem("sbh_cake_requests");
      return stored ? JSON.parse(stored) : this.mockCakeRequests;
    } catch { return this.mockCakeRequests; }
  },

  saveCakeRequest(req) {
    const requests = this.getCakeRequests();
    requests.unshift(req);
    try { localStorage.setItem("sbh_cake_requests", JSON.stringify(requests)); } catch {}
  },

  // ------ CART OPERATIONS ------
  addToCart(product, qty = 1) {
    const cart = this.getCart();
    const idx = cart.findIndex(i => i.id === product.id);
    if (idx > -1) {
      cart[idx].qty += qty;
    } else {
      cart.push({ id: product.id, name: product.name, price: product.price, emoji: product.emoji, qty });
    }
    this.saveCart(cart);
    return cart;
  },

  removeFromCart(productId) {
    const cart = this.getCart().filter(i => i.id !== productId);
    this.saveCart(cart);
    return cart;
  },

  updateCartQty(productId, qty) {
    if (qty <= 0) return this.removeFromCart(productId);
    const cart = this.getCart().map(i => i.id === productId ? { ...i, qty } : i);
    this.saveCart(cart);
    return cart;
  },

  clearCart() {
    this.saveCart([]);
  },

  getCartCount() {
    return this.getCart().reduce((s, i) => s + i.qty, 0);
  },

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
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? "flex" : "none";
    }
  },

  // ------ BEST SELLERS ------
  getBestSellers(category = null, limit = 4) {
    const products = this.getProducts();
    let filtered = products.filter(p => p.bestSeller && p.status === "instock");
    if (category) filtered = filtered.filter(p => p.category === category);
    return filtered.slice(0, limit);
  },

  getBestSellersByCategory(limit = 3) {
    return {
      Cookies: this.getBestSellers("Cookies", limit),
      Cakes:   this.getBestSellers("Cakes",   limit),
      Bakery:  this.getBestSellers("Bakery",  limit)
    };
  },

  // ------ MOCK DATA ------
  mockOrders: [
    { id: "SBH-001", customer: "Amara Johnson", email: "amara@email.com", items: "Chocolate Chip Cookies x2", total: 29.98, status: "completed", date: "Apr 10, 2025", method: "pickup" },
    { id: "SBH-002", customer: "David Park",    email: "david@email.com", items: "Red Velvet Cake, Blueberry Muffins", total: 66.98, status: "pending",   date: "Apr 12, 2025", method: "delivery" },
    { id: "SBH-003", customer: "Lisa Chen",     email: "lisa@email.com",  items: "Strawberry Shortcake", total: 42.99, status: "completed", date: "Apr 11, 2025", method: "pickup" },
    { id: "SBH-004", customer: "Mike Rivera",   email: "mike@email.com",  items: "Snickerdoodle x3, Sourdough", total: 50.96, status: "pending",   date: "Apr 13, 2025", method: "delivery" },
    { id: "SBH-005", customer: "Priya Shah",    email: "priya@email.com", items: "Lemon Drizzle Loaf x2", total: 57.98, status: "cancelled", date: "Apr 9, 2025",  method: "pickup" }
  ],

  mockCakeRequests: [
    { id: "CR-001", name: "Priya Sharma", email: "priya@email.com", phone: "(301) 555-1234", date: "Apr 20, 2025", size: "8-inch", flavor: "Vanilla", frosting: "Buttercream", design: "Floral garden theme in blush pink and gold, 'Happy Birthday Maya' in script. Serves 15.", method: "pickup", notes: "No nuts please.", status: "pending",  submitted: "Apr 5, 2025" },
    { id: "CR-002", name: "Tom Williams", email: "tom@email.com",   phone: "(240) 555-5678", date: "Apr 18, 2025", size: "10-inch", flavor: "Red Velvet", frosting: "Cream Cheese", design: "25th Anniversary cake, navy and gold colour scheme, 'Tom & Sarah' with decorative rings.", method: "delivery", notes: "", status: "approved", submitted: "Apr 3, 2025" }
  ]
};
