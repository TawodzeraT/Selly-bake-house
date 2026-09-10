const { onRequest } = require("firebase-functions/v2/https");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");
const cors = require("cors")({
  origin: true
});

admin.initializeApp();

const db = admin.firestore();

setGlobalOptions({
  region: "us-east1",
  maxInstances: 10
});


/*
 * ============================================================
 * Health check
 * ============================================================
 */

exports.health = onRequest(
  {
    cors: true
  },
  async (req, res) => {
    res.status(200).json({
      success: true,
      service: "selly-bake-house-functions",
      status: "online"
    });
  }
);


/*
 * ============================================================
 * Get public products
 * ============================================================
 *
 * The browser can eventually call this instead of maintaining
 * the product catalog entirely inside scripts.js.
 */

exports.getProducts = onRequest(
  {
    cors: true
  },
  async (req, res) => {

    try {

      const snapshot = await db
        .collection("products")
        .where("published", "==", true)
        .get();

      const products = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      res.status(200).json({
        success: true,
        products
      });

    } catch (error) {

      console.error("getProducts error:", error);

      res.status(500).json({
        success: false,
        error: "Unable to load products."
      });
    }
  }
);


/*
 * ============================================================
 * Create order
 * ============================================================
 *
 * IMPORTANT:
 *
 * This is intentionally not implemented yet.
 *
 * We will migrate the existing server-side order validation
 * from server.js here before allowing orders to be created.
 *
 * The server must calculate/validate:
 *
 * - product
 * - variant
 * - quantity
 * - price
 * - fulfillment
 * - delivery fee
 * - tip
 * - tax
 * - total
 *
 * The browser must NEVER be trusted to supply the final price.
 */

exports.createOrder = onCall(
  async (request) => {

    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "You must be signed in to create an order."
      );
    }

    throw new HttpsError(
      "failed-precondition",
      "Order processing has not been enabled yet."
    );
  }
);


/*
 * ============================================================
 * Admin-only test
 * ============================================================
 */

exports.adminTest = onCall(
  async (request) => {

    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "Authentication required."
      );
    }

    if (request.auth.token.admin !== true) {
      throw new HttpsError(
        "permission-denied",
        "Administrator access required."
      );
    }

    return {
      success: true,
      message: "Administrator authentication is working."
    };
  }
);


/*
 * ============================================================
 * Future Square payment function
 * ============================================================
 *
 * The Square access token will be stored as a server-side
 * Firebase secret/environment value.
 *
 * It will NEVER be placed in:
 *
 * - index.html
 * - scripts.js
 * - firebase/config.js
 * - Firestore
 */

exports.createSquarePayment = onCall(
  async (request) => {

    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "Authentication required."
      );
    }

    throw new HttpsError(
      "failed-precondition",
      "Square payment processing has not been migrated yet."
    );
  }
);
