/*
 * SELLY BAKE HOUSE — FIREBASE FIRESTORE DATABASE LAYER
 *
 * This file keeps the existing window.DB API used by the website while
 * replacing the old Supabase REST connection with Firebase Firestore.
 * Firebase is loaded from the official CDN, so the existing plain HTML
 * pages do not need a bundler.
 */

(function () {
  "use strict";

  var DB = {};
  var readyPromise = null;
  var firebaseDb = null;
  var firebaseAuth = null;

  function getFallback(name, value) {
    try {
      return window.SBH && window.SBH[name] ? window.SBH[name] : value;
    } catch (e) {
      return value;
    }
  }

  async function init() {
    if (readyPromise) return readyPromise;

    readyPromise = (async function () {
      var configModule = await import("../firebase/config.js");
      var config = configModule.default;

      var appMod = await import("https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js");
      var firestoreMod = await import("https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js");
      var authMod = await import("https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js");

      var app = appMod.getApps().length
        ? appMod.getApps()[0]
        : appMod.initializeApp(config);

      firebaseDb = firestoreMod.getFirestore(app);
      firebaseAuth = authMod.getAuth(app);

      window.SellyFirebase = {
        app: app,
        db: firebaseDb,
        auth: firebaseAuth,
        firestore: firestoreMod,
        authModule: authMod
      };

      console.log("Selly Bake House: Firebase connected.");
      return window.SellyFirebase;
    })().catch(function (error) {
      console.error("Selly Bake House: Firebase initialization failed.", error);
      throw error;
    });

    return readyPromise;
  }

  async function fs() {
    var fb = await init();
    return fb.firestore;
  }

  async function db() {
    await init();
    return firebaseDb;
  }

  async function collectionDocs(name, constraints) {
    var f = await fs();
    var database = await db();
    var ref = f.collection(database, name);
    var q = ref;
    if (constraints && constraints.length) q = f.query.apply(null, [ref].concat(constraints));
    var snap = await f.getDocs(q);
    return snap.docs.map(function (doc) {
      return Object.assign({ id: doc.id }, doc.data());
    });
  }

  async function getDocById(name, id) {
    var f = await fs();
    var database = await db();
    var snap = await f.getDoc(f.doc(database, name, String(id)));
    return snap.exists() ? Object.assign({ id: snap.id }, snap.data()) : null;
  }

  async function setDocData(name, id, data, merge) {
    var f = await fs();
    var database = await db();
    await f.setDoc(f.doc(database, name, String(id)), data, { merge: !!merge });
    return Object.assign({ id: String(id) }, data);
  }

  async function addDocData(name, data) {
    var f = await fs();
    var database = await db();
    var ref = await f.addDoc(f.collection(database, name), data);
    return Object.assign({ id: ref.id }, data);
  }

  async function deleteDocData(name, id) {
    var f = await fs();
    var database = await db();
    await f.deleteDoc(f.doc(database, name, String(id)));
    return true;
  }

  function cleanProduct(p) {
    return {
      id: p.id,
      name: p.name || "",
      category: p.category || "",
      price: parseFloat(p.price) || 0,
      desc: p.desc || p.description || "",
      longDesc: p.longDesc || p.long_desc || p.description || "",
      status: p.status || "instock",
      bestSeller: !!(p.bestSeller !== undefined ? p.bestSeller : p.best_seller),
      isNew: !!(p.isNew !== undefined ? p.isNew : p.is_new),
      featured: !!p.featured,
      allergens: p.allergens || "",
      image: p.image || p.image_data || ""
    };
  }

  DB.ready = init;

  DB.getProducts = async function () {
    try {
      var f = await fs();
      var products = await collectionDocs("products", [f.orderBy("id", "asc")]);
      if (!products.length) return getFallback("defaultProducts", []);
      return products.map(cleanProduct);
    } catch (error) {
      console.warn("Could not load products from Firebase:", error);
      return getFallback("defaultProducts", []);
    }
  };

  DB.saveProduct = async function (product) {
    var row = {
      name: product.name || "",
      category: product.category || "",
      price: Number(product.price) || 0,
      description: product.desc || product.description || "",
      long_desc: product.longDesc || product.long_desc || product.desc || "",
      status: product.status || "instock",
      best_seller: !!(product.bestSeller !== undefined ? product.bestSeller : product.best_seller),
      is_new: !!(product.isNew !== undefined ? product.isNew : product.is_new),
      featured: !!product.featured,
      allergens: product.allergens || ""
    };
    var id = product.id != null ? String(product.id) : null;
    if (id) return setDocData("products", id, row, true);
    return addDocData("products", row);
  };

  DB.updateProductStatus = async function (id, status) {
    return setDocData("products", id, { status: status }, true);
  };

  DB.saveProductImage = async function (productId, imageData) {
    return setDocData("products", productId, { image_data: imageData || "" }, true);
  };

  DB.deleteProductImage = async function (productId) {
    return setDocData("products", productId, { image_data: "" }, true);
  };

  DB.getOrders = async function () {
    try {
      var f = await fs();
      return await collectionDocs("orders", [f.orderBy("created_at", "desc")]);
    } catch (error) {
      try { return await collectionDocs("orders"); } catch (e) { return []; }
    }
  };

  DB.saveOrder = async function (order) {
    /*
     * Direct client-side order creation is intentionally blocked by the
     * Firestore rules. Checkout should eventually call a Cloud Function so
     * totals and payment information are validated server-side.
     */
    throw new Error("Orders must be submitted through the secure checkout function.");
  };

  DB.updateOrderStatus = async function (id, status) {
    return setDocData("orders", id, { status: status }, true);
  };

  DB.getOrderById = async function (id) {
    return getDocById("orders", id);
  };

  DB.getCakeRequests = async function () {
    try {
      var f = await fs();
      return await collectionDocs("customInquiries", [f.orderBy("submitted_at", "desc")]);
    } catch (error) {
      try { return await collectionDocs("customInquiries"); } catch (e) { return []; }
    }
  };

  DB.saveCakeRequest = async function (req) {
    var row = {
      name: req.name || "",
      email: req.email || "",
      phone: req.phone || "",
      size: req.size || "",
      flavor: req.flavor || "",
      frosting: req.frosting || "",
      filling: req.filling || "",
      addons: Array.isArray(req.addons) ? req.addons : [],
      design: req.design || "",
      date_needed: req.date || "",
      method: req.method || "pickup",
      notes: req.notes || "",
      status: "pending",
      submitted_at: new Date().toISOString()
    };
    return addDocData("customInquiries", row);
  };

  DB.updateCakeRequest = async function (id, status) {
    return setDocData("customInquiries", id, { status: status }, true);
  };

  DB.getBlockedDates = async function () {
    try {
      var rows = await collectionDocs("blockedDates");
      return rows.map(function (d) { return d.date_str || d.date || d.id; });
    } catch (error) {
      return [];
    }
  };

  DB.addBlockedDate = async function (dateStr) {
    return setDocData("blockedDates", dateStr, { date_str: dateStr }, true);
  };

  DB.removeBlockedDate = async function (dateStr) {
    return deleteDocData("blockedDates", dateStr);
  };

  DB.getCategories = async function () {
    try {
      var f = await fs();
      var rows = await collectionDocs("categories", [f.orderBy("display_order", "asc")]);
      if (!rows.length) return getFallback("defaultCategories", []);
      return rows.map(function (c) {
        return {
          id: c.id,
          name: c.name || "",
          color: c.color || "",
          order: c.order !== undefined ? c.order : (c.display_order || 0),
          active: c.active !== false
        };
      });
    } catch (error) {
      return getFallback("defaultCategories", []);
    }
  };

  DB.saveCategory = async function (cat) {
    var id = cat.id != null ? String(cat.id) : null;
    var row = {
      name: cat.name || "",
      color: cat.color || "",
      display_order: Number(cat.order) || 0,
      active: cat.active !== false
    };
    return id ? setDocData("categories", id, row, true) : addDocData("categories", row);
  };

  DB.deleteCategory = async function (id) {
    return deleteDocData("categories", id);
  };

  DB.getSettings = async function () {
    try {
      var store = await getDocById("settings", "store");
      if (store && store.settings) return store.settings;
      if (store) {
        var copy = Object.assign({}, store);
        delete copy.id;
        return copy;
      }
      return {};
    } catch (error) {
      return {};
    }
  };

  DB.saveSetting = async function (key, value) {
    var current = await DB.getSettings();
    current[key] = value;
    return setDocData("settings", "store", { settings: current }, true);
  };

  DB.saveFeedback = async function (feedback) {
    return addDocData("feedback", {
      order_id: feedback.id || "",
      customer: feedback.customer || "",
      email: feedback.email || "",
      rating: Number(feedback.rating) || 5,
      message: feedback.text || "",
      created_at: new Date().toISOString()
    });
  };

  DB.getFeedback = async function () {
    try {
      var f = await fs();
      return await collectionDocs("feedback", [f.orderBy("created_at", "desc")]);
    } catch (error) {
      try { return await collectionDocs("feedback"); } catch (e) { return []; }
    }
  };

  DB.seedProducts = async function () {
    var products = getFallback("defaultProducts", []);
    for (var i = 0; i < products.length; i++) {
      await DB.saveProduct(products[i]);
      console.log("Saved product: " + products[i].name);
    }
    console.log("Firebase product seed complete.");
    return true;
  };

  DB.seedCategories = async function () {
    var categories = getFallback("defaultCategories", []);
    for (var i = 0; i < categories.length; i++) {
      await DB.saveCategory(categories[i]);
      console.log("Saved category: " + categories[i].name);
    }
    console.log("Firebase category seed complete.");
    return true;
  };

  DB.getProductImages = async function (productId) {
    try {
      var f = await fs();
      return await collectionDocs("productImages", [
        f.where("product_id", "==", String(productId)),
        f.orderBy("sort_order", "asc")
      ]);
    } catch (error) {
      return [];
    }
  };

  DB.addProductImage = async function (productId, imageData, isPrimary) {
    if (isPrimary) {
      var existing = await DB.getProductImages(productId);
      for (var i = 0; i < existing.length; i++) {
        await setDocData("productImages", existing[i].id, { is_primary: false }, true);
      }
    }
    return addDocData("productImages", {
      product_id: String(productId),
      image_data: imageData || "",
      is_primary: !!isPrimary,
      sort_order: Date.now()
    });
  };

  DB.deleteProductImageById = async function (imageId) {
    return deleteDocData("productImages", imageId);
  };

  DB.setPrimaryImage = async function (imageId, productId) {
    var existing = await DB.getProductImages(productId);
    for (var i = 0; i < existing.length; i++) {
      await setDocData("productImages", existing[i].id, { is_primary: existing[i].id === String(imageId) }, true);
    }
    return true;
  };

  DB.getPrimaryImage = async function (productId) {
    var images = await DB.getProductImages(productId);
    if (!images.length) return "";
    var primary = images.find(function (x) { return x.is_primary; });
    return (primary || images[0]).image_data || "";
  };

  DB.reorderProductImages = async function (imageId, newOrder) {
    return setDocData("productImages", imageId, { sort_order: Number(newOrder) || 0 }, true);
  };

  window.DB = DB;
  window.SellyDB = DB;

  // Start loading Firebase immediately without blocking page parsing.
  init().catch(function () {});
})();
