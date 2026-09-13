/*
 * SELLY BAKE HOUSE — FIREBASE FIRESTORE DATABASE LAYER
 * Keeps the existing window.DB API while replacing Supabase with Firebase.
 */
(function () {
  "use strict";

  var DB = {};
  var readyPromise = null;
  var firebaseDb = null;
  var firebaseAuth = null;
  var FIREBASE_VERSION = "12.19.0";

  function fallback(name, value) {
    try { return window.SBH && window.SBH[name] ? window.SBH[name] : value; }
    catch (e) { return value; }
  }

  async function init() {
    if (readyPromise) return readyPromise;
    readyPromise = (async function () {
      var configModule = await import("../firebase/config.js");
      var config = configModule.default;
      var appMod = await import("https://www.gstatic.com/firebasejs/" + FIREBASE_VERSION + "/firebase-app.js");
      var firestoreMod = await import("https://www.gstatic.com/firebasejs/" + FIREBASE_VERSION + "/firebase-firestore.js");
      var authMod = await import("https://www.gstatic.com/firebasejs/" + FIREBASE_VERSION + "/firebase-auth.js");
      var app = appMod.getApps().length ? appMod.getApps()[0] : appMod.initializeApp(config);
      firebaseDb = firestoreMod.getFirestore(app);
      firebaseAuth = authMod.getAuth(app);
      window.SellyFirebase = { app: app, db: firebaseDb, auth: firebaseAuth, firestore: firestoreMod, authModule: authMod };
      console.log("Selly Bake House: Firebase connected.");
      return window.SellyFirebase;
    })().catch(function (error) {
      console.error("Selly Bake House: Firebase initialization failed.", error);
      throw error;
    });
    return readyPromise;
  }

  async function fsm() { var fb = await init(); return fb.firestore; }
  async function database() { await init(); return firebaseDb; }

  async function collectionDocs(name, constraints) {
    var f = await fsm(), d = await database();
    var ref = f.collection(d, name);
    var q = constraints && constraints.length ? f.query.apply(null, [ref].concat(constraints)) : ref;
    var snap = await f.getDocs(q);
    return snap.docs.map(function (doc) { return Object.assign({ id: doc.id }, doc.data()); });
  }

  async function getDocById(name, id) {
    var f = await fsm(), d = await database();
    var snap = await f.getDoc(f.doc(d, name, String(id)));
    return snap.exists() ? Object.assign({ id: snap.id }, snap.data()) : null;
  }

  async function setDocData(name, id, data, merge) {
    var f = await fsm(), d = await database();
    await f.setDoc(f.doc(d, name, String(id)), data, { merge: !!merge });
    return Object.assign({ id: String(id) }, data);
  }

  async function addDocData(name, data) {
    var f = await fsm(), d = await database();
    var ref = await f.addDoc(f.collection(d, name), data);
    return Object.assign({ id: ref.id }, data);
  }

  async function deleteDocData(name, id) {
    var f = await fsm(), d = await database();
    await f.deleteDoc(f.doc(d, name, String(id)));
    return true;
  }

  function cleanProduct(p) {
    return {
      id: p.id, name: p.name || "", category: p.category || "", price: parseFloat(p.price) || 0,
      desc: p.desc || p.description || "", longDesc: p.longDesc || p.long_desc || p.description || "",
      status: p.status || "instock", bestSeller: !!(p.bestSeller !== undefined ? p.bestSeller : p.best_seller),
      isNew: !!(p.isNew !== undefined ? p.isNew : p.is_new), featured: !!p.featured,
      allergens: p.allergens || "", image: p.image || p.image_data || ""
    };
  }

  DB.ready = init;

  DB.getProducts = async function () {
    try {
      var f = await fsm();
      var products = await collectionDocs("products", [f.orderBy("id", "asc")]);
      return products.length ? products.map(cleanProduct) : fallback("defaultProducts", []);
    } catch (e) { console.warn("Could not load products from Firebase:", e); return fallback("defaultProducts", []); }
  };

  DB.saveProduct = async function (product) {
    var row = {
      name: product.name || "", category: product.category || "", price: Number(product.price) || 0,
      description: product.desc || product.description || "", long_desc: product.longDesc || product.long_desc || product.desc || "",
      status: product.status || "instock", best_seller: !!(product.bestSeller !== undefined ? product.bestSeller : product.best_seller),
      is_new: !!(product.isNew !== undefined ? product.isNew : product.is_new), featured: !!product.featured, allergens: product.allergens || ""
    };
    return product.id != null ? setDocData("products", product.id, row, true) : addDocData("products", row);
  };

  DB.updateProductStatus = function (id, status) { return setDocData("products", id, { status: status }, true); };
  DB.saveProductImage = function (id, imageData) { return setDocData("products", id, { image_data: imageData || "" }, true); };
  DB.deleteProductImage = function (id) { return setDocData("products", id, { image_data: "" }, true); };

  DB.getOrders = async function () {
    try { var f = await fsm(); return await collectionDocs("orders", [f.orderBy("created_at", "desc")]); }
    catch (e) { try { return await collectionDocs("orders"); } catch (x) { return []; } }
  };

  DB.saveOrder = async function () {
    throw new Error("Orders must be submitted through the secure checkout function.");
  };
  DB.updateOrderStatus = function (id, status) { return setDocData("orders", id, { status: status }, true); };
  DB.getOrderById = function (id) { return getDocById("orders", id); };

  DB.getCakeRequests = async function () {
    try { var f = await fsm(); return await collectionDocs("customInquiries", [f.orderBy("submitted_at", "desc")]); }
    catch (e) { try { return await collectionDocs("customInquiries"); } catch (x) { return []; } }
  };

  DB.saveCakeRequest = function (req) {
    return addDocData("customInquiries", {
      name: req.name || "", email: req.email || "", phone: req.phone || "", size: req.size || "", flavor: req.flavor || "",
      frosting: req.frosting || "", filling: req.filling || "", addons: Array.isArray(req.addons) ? req.addons : [],
      design: req.design || "", date_needed: req.date || "", method: req.method || "pickup", notes: req.notes || "",
      status: "pending", submitted_at: new Date().toISOString()
    });
  };
  DB.updateCakeRequest = function (id, status) { return setDocData("customInquiries", id, { status: status }, true); };

  DB.getBlockedDates = async function () {
    try { return (await collectionDocs("blockedDates")).map(function (d) { return d.date_str || d.date || d.id; }); }
    catch (e) { return []; }
  };
  DB.addBlockedDate = function (dateStr) { return setDocData("blockedDates", dateStr, { date_str: dateStr }, true); };
  DB.removeBlockedDate = function (dateStr) { return deleteDocData("blockedDates", dateStr); };

  DB.getCategories = async function () {
    try {
      var f = await fsm(), rows = await collectionDocs("categories", [f.orderBy("display_order", "asc")]);
      if (!rows.length) return fallback("defaultCategories", []);
      return rows.map(function (c) { return { id: c.id, name: c.name || "", color: c.color || "", order: c.order !== undefined ? c.order : (c.display_order || 0), active: c.active !== false }; });
    } catch (e) { return fallback("defaultCategories", []); }
  };
  DB.saveCategory = function (cat) {
    var row = { name: cat.name || "", color: cat.color || "", display_order: Number(cat.order) || 0, active: cat.active !== false };
    return cat.id != null ? setDocData("categories", cat.id, row, true) : addDocData("categories", row);
  };
  DB.deleteCategory = function (id) { return deleteDocData("categories", id); };

  DB.getSettings = async function () {
    try {
      var store = await getDocById("settings", "store");
      if (!store) return {};
      if (store.settings) return store.settings;
      delete store.id;
      return store;
    } catch (e) { return {}; }
  };
  DB.saveSetting = async function (key, value) {
    var current = await DB.getSettings(); current[key] = value;
    return setDocData("settings", "store", { settings: current }, true);
  };

  DB.saveFeedback = function (feedback) {
    return addDocData("feedback", { order_id: feedback.id || "", customer: feedback.customer || "", email: feedback.email || "", rating: Number(feedback.rating) || 5, message: feedback.text || "", created_at: new Date().toISOString() });
  };
  DB.getFeedback = async function () {
    try { var f = await fsm(); return await collectionDocs("feedback", [f.orderBy("created_at", "desc")]); }
    catch (e) { try { return await collectionDocs("feedback"); } catch (x) { return []; } }
  };

  DB.seedProducts = async function () {
    var products = fallback("defaultProducts", []);
    for (var i = 0; i < products.length; i++) { await DB.saveProduct(products[i]); console.log("Saved product: " + products[i].name); }
    return true;
  };
  DB.seedCategories = async function () {
    var categories = fallback("defaultCategories", []);
    for (var i = 0; i < categories.length; i++) { await DB.saveCategory(categories[i]); console.log("Saved category: " + categories[i].name); }
    return true;
  };

  DB.getProductImages = async function (productId) {
    try {
      var f = await fsm();
      return await collectionDocs("productImages", [f.where("product_id", "==", String(productId)), f.orderBy("sort_order", "asc")]);
    } catch (e) { return []; }
  };
  DB.addProductImage = async function (productId, imageData, isPrimary) {
    if (isPrimary) {
      var existing = await DB.getProductImages(productId);
      for (var i = 0; i < existing.length; i++) await setDocData("productImages", existing[i].id, { is_primary: false }, true);
    }
    return addDocData("productImages", { product_id: String(productId), image_data: imageData || "", is_primary: !!isPrimary, sort_order: Date.now() });
  };
  DB.deleteProductImage = function (imageId) { return deleteDocData("productImages", imageId); };
  DB.deleteProductImageById = DB.deleteProductImage;
  DB.setPrimaryImage = async function (imageId, productId) {
    var existing = await DB.getProductImages(productId);
    for (var i = 0; i < existing.length; i++) await setDocData("productImages", existing[i].id, { is_primary: existing[i].id === String(imageId) }, true);
    return true;
  };
  DB.getPrimaryImage = async function (productId) {
    var images = await DB.getProductImages(productId); if (!images.length) return "";
    var primary = images.find(function (x) { return x.is_primary; }); return (primary || images[0]).image_data || "";
  };
  DB.reorderProductImages = function (imageId, newOrder) { return setDocData("productImages", imageId, { sort_order: Number(newOrder) || 0 }, true); };

  window.DB = DB;
  window.SellyDB = DB;
  init().catch(function () {});
})();
