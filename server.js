'use strict';

const http = require('http');
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

function loadLocalEnvironment() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;
  for (const rawLine of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const separator = line.indexOf('=');
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (!(key in process.env)) process.env[key] = value;
  }
}
loadLocalEnvironment();

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const ADMIN_FILE = path.join(DATA_DIR, 'ADMIN_FIRST_LOGIN.txt');
const PORT = Number(process.env.PORT || 3000);
const SESSION_DAYS = 7;
const MAX_BODY = 32 * 1024 * 1024;

const DEFAULT_SETTINGS = {
  announcement: 'Freshly baked in Rockville, Maryland',
  email: 'sellybakehouse@gmail.com',
  phone: '(301) 356-1232',
  acceptingOrders: true,
  deliveryFee: 8.99,
  deliveryIncludedMiles: 3,
  deliveryPerMile: 1.50,
  deliveryMaxMiles: 35,
  leadTimeHours: 24,
  weekdayStart: '09:00',
  weekdayEnd: '18:00',
  weekendStart: '09:00',
  weekendEnd: '19:00',
  heroIntervalSeconds: 5,
  googleMapsApiKey: process.env.GOOGLE_MAPS_BROWSER_API_KEY || ''
};

const PRODUCT_PRICES = {
  'red-velvet-cookie': { '6-pack': 24.99 },
  'classic-chocolate-chip-cookie': { '6-pack': 24.99 },
  'triple-chocolate-cookie': { '6-pack': 24.99 },
  'nutella-bueno-cookie': { '6-pack': 24.99 },
  'biscoff-cookie': { '6-pack': 24.99 },
  'birthday-cookie': { '6-pack': 24.99 },
  'vanilla-cupcake': { '6-pack': 21.99 },
  'red-velvet-cupcake': { '6-pack': 21.99 },
  'chocolate-cupcake': { '6-pack': 21.99 },
  'vanilla-cake': { '6-inch': 46.99, '8-inch': 72.99, '10-inch': 97.99 },
  'red-velvet-cake': { '6-inch': 46.99, '8-inch': 72.99, '10-inch': 97.99 },
  'chocolate-cake': { '6-inch': 46.99, '8-inch': 72.99, '10-inch': 97.99 }
};

const PRODUCT_NAMES = {
  'red-velvet-cookie':'Red Velvet Cookie', 'classic-chocolate-chip-cookie':'Classic Chocolate Chip',
  'triple-chocolate-cookie':'Triple Chocolate Cookie', 'nutella-bueno-cookie':'Nutella Bueno Cookie',
  'biscoff-cookie':'Biscoff Cookie', 'birthday-cookie':'Birthday Cookie',
  'vanilla-cupcake':'Vanilla Cupcakes', 'red-velvet-cupcake':'Red Velvet Cupcakes', 'chocolate-cupcake':'Chocolate Cupcakes',
  'vanilla-cake':'Vanilla Cake', 'red-velvet-cake':'Red Velvet Cake', 'chocolate-cake':'Chocolate Cake'
};

let db = null;
let writeQueue = Promise.resolve();
const requestBuckets = new Map();

function baseDb() {
  return { settings: { ...DEFAULT_SETTINGS }, users: [], sessions: [], orders: [], customInquiries: [] };
}

async function loadDb() {
  await fsp.mkdir(DATA_DIR, { recursive: true });
  try {
    db = JSON.parse(await fsp.readFile(DB_FILE, 'utf8'));
  } catch {
    db = baseDb();
  }
  db.settings = { ...DEFAULT_SETTINGS, ...(db.settings || {}) };
  if (!db.settings.googleMapsApiKey && process.env.GOOGLE_MAPS_BROWSER_API_KEY) db.settings.googleMapsApiKey = process.env.GOOGLE_MAPS_BROWSER_API_KEY;
  db.users = Array.isArray(db.users) ? db.users : [];
  db.sessions = Array.isArray(db.sessions) ? db.sessions : [];
  db.orders = Array.isArray(db.orders) ? db.orders : [];
  db.customInquiries = Array.isArray(db.customInquiries) ? db.customInquiries : [];
  pruneSessions();
  await ensureAdmin();
  await saveDb();
}

function saveDb() {
  writeQueue = writeQueue.then(async () => {
    const temp = `${DB_FILE}.tmp`;
    await fsp.writeFile(temp, JSON.stringify(db, null, 2), { mode: 0o600 });
    await fsp.rename(temp, DB_FILE);
  });
  return writeQueue;
}

function pruneSessions() {
  const now = Date.now();
  db.sessions = db.sessions.filter(session => Number(session.expiresAt) > now);
}

function randomPassword() {
  return `${crypto.randomBytes(8).toString('base64url')}!A7`;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  try {
    const [salt, expectedHex] = String(stored).split(':');
    const actual = crypto.scryptSync(password, salt, 64);
    const expected = Buffer.from(expectedHex, 'hex');
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  } catch { return false; }
}

async function ensureAdmin() {
  if (db.users.some(user => user.role === 'admin')) return;
  const email = String(process.env.ADMIN_EMAIL || 'sellybakehouse@gmail.com').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || randomPassword();
  db.users.push({ id: crypto.randomUUID(), name: 'Selly Bake House Admin', email, passwordHash: hashPassword(password), role: 'admin', createdAt: new Date().toISOString() });
  const message = `Selly Bake House first admin login\n\nEmail: ${email}\nPassword: ${password}\n\nChange this password by deleting data/database.json and restarting with ADMIN_PASSWORD set, or add a password-change workflow before production.\nDo not publish this file.\n`;
  await fsp.writeFile(ADMIN_FILE, message, { mode: 0o600 });
  console.log('\nFIRST ADMIN LOGIN');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log(`Saved locally to: ${ADMIN_FILE}\n`);
}

function json(res, status, payload, headers = {}) {
  const body = JSON.stringify(payload);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body), 'Cache-Control':'no-store', ...headers });
  res.end(body);
}

function text(res, status, body, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': contentType, 'Content-Length': Buffer.byteLength(body) });
  res.end(body);
}

async function readJson(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY) throw Object.assign(new Error('Request body is too large.'), { status: 413 });
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw Object.assign(new Error('Invalid JSON request.'), { status: 400 }); }
}

function parseCookies(req) {
  return Object.fromEntries(String(req.headers.cookie || '').split(';').map(part => part.trim()).filter(Boolean).map(part => {
    const index = part.indexOf('=');
    return [decodeURIComponent(part.slice(0, index)), decodeURIComponent(part.slice(index + 1))];
  }));
}

function currentSession(req) {
  pruneSessions();
  const token = parseCookies(req).sbh_session;
  if (!token) return null;
  const session = db.sessions.find(item => item.token === token);
  if (!session) return null;
  const user = db.users.find(item => item.id === session.userId);
  return user ? { session, user } : null;
}

function publicUser(user) {
  return user ? { id: user.id, name: user.name, email: user.email, role: user.role } : null;
}

function sessionCookie(token, maxAgeSeconds) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `sbh_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${secure}`;
}

function requireAdmin(req) {
  const auth = currentSession(req);
  if (!auth || auth.user.role !== 'admin') throw Object.assign(new Error('Administrator access is required.'), { status: 403 });
  return auth;
}

function validateEmail(value) {
  const email = String(value || '').trim().toLowerCase();
  if (email.length > 160 || email.includes('..') || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i.test(email)) {
    throw Object.assign(new Error('Enter a valid email address.'), { status: 400 });
  }
  return email;
}

function validateOptionalEmail(value) {
  const email = String(value || '').trim();
  return email ? validateEmail(email) : '';
}

function validateName(value, label = 'Name') {
  const name = String(value || '').trim().replace(/\s+/g, ' ');
  if (!/^[\p{L}\p{M}][\p{L}\p{M} .'’\-]{1,79}$/u.test(name)) {
    throw Object.assign(new Error(`Enter a valid ${label.toLowerCase()}.`), { status: 400 });
  }
  return name;
}

function validatePhone(value) {
  let digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1);
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(digits)) {
    throw Object.assign(new Error('Enter a valid 10-digit U.S. phone number.'), { status: 400 });
  }
  return digits.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}

function validateMarylandZip(value) {
  const zip = String(value || '').trim();
  if (!/^2(?:0[6-9]|1\d)\d{2}(?:-\d{4})?$/.test(zip)) {
    throw Object.assign(new Error('Enter a valid Maryland ZIP code.'), { status: 400 });
  }
  return zip;
}

function validateStreetAddress(value) {
  const line = String(value || '').trim().replace(/\s+/g, ' ');
  if (line.length < 5 || line.length > 120 || !/\d/.test(line) || !/[A-Za-z]/.test(line)) {
    throw Object.assign(new Error('Enter a complete street address including a street number.'), { status: 400 });
  }
  return line;
}

function validateCity(value) {
  const city = String(value || '').trim().replace(/\s+/g, ' ');
  if (!/^[A-Za-z][A-Za-z .'\-]{1,59}$/.test(city)) {
    throw Object.assign(new Error('Enter a valid Maryland city.'), { status: 400 });
  }
  return city;
}

function marylandCalendarDayUtc(date = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone:'America/New_York', year:'numeric', month:'2-digit', day:'2-digit'
  }).formatToParts(date).filter(part => part.type !== 'literal').map(part => [part.type, Number(part.value)]));
  return Date.UTC(parts.year, parts.month - 1, parts.day);
}

function validateFutureDate(value, minimumDays) {
  const dateValue = String(value || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) throw Object.assign(new Error('Choose a valid event date.'), { status:400 });
  const [year, month, day] = dateValue.split('-').map(Number);
  const target = Date.UTC(year, month - 1, day);
  const check = new Date(target);
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) {
    throw Object.assign(new Error('Choose a valid event date.'), { status:400 });
  }
  if (target < marylandCalendarDayUtc() + minimumDays * 86400000) {
    throw Object.assign(new Error(`Custom cake requests require at least ${minimumDays} days of lead time.`), { status:400 });
  }
  return dateValue;
}

function enforceRateLimit(req, scope, limit, windowMs) {
  const now = Date.now();
  const ip = String(req.socket.remoteAddress || 'unknown');
  const key = `${scope}:${ip}`;
  const active = (requestBuckets.get(key) || []).filter(timestamp => now - timestamp < windowMs);
  if (active.length >= limit) throw Object.assign(new Error('Too many submissions were received. Please wait and try again.'), { status:429 });
  active.push(now);
  requestBuckets.set(key, active);
}

function validateSettings(input) {
  const next = { ...db.settings };
  next.announcement = String(input.announcement || '').trim().slice(0, 140);
  next.email = validateEmail(input.email);
  next.phone = String(input.phone || '').trim().slice(0, 40);
  next.acceptingOrders = Boolean(input.acceptingOrders);
  next.deliveryFee = Number(input.deliveryFee);
  next.leadTimeHours = Number(input.leadTimeHours);
  next.heroIntervalSeconds = Number(input.heroIntervalSeconds);
  next.googleMapsApiKey = String(input.googleMapsApiKey || '').trim().slice(0, 200);
  for (const key of ['weekdayStart','weekdayEnd','weekendStart','weekendEnd']) {
    const value = String(input[key] || '');
    if (!/^(?:[01]\d|2[0-3]):(?:00|30)$/.test(value)) throw Object.assign(new Error('Business hours must use 30-minute times such as 09:00 or 18:30.'), { status: 400 });
    next[key] = value;
  }
  const toMinutes = value => {
    const [hours, minutes] = value.split(':').map(Number);
    return hours * 60 + minutes;
  };
  if (toMinutes(next.weekdayStart) >= toMinutes(next.weekdayEnd) || toMinutes(next.weekendStart) >= toMinutes(next.weekendEnd)) {
    throw Object.assign(new Error('Each opening time must be earlier than its closing time.'), { status: 400 });
  }
  if (!next.phone) throw Object.assign(new Error('Phone number is required.'), { status: 400 });
  if (!Number.isFinite(next.deliveryFee) || next.deliveryFee < 0 || next.deliveryFee > 500) throw Object.assign(new Error('Delivery fee must be between $0 and $500.'), { status: 400 });
  if (!Number.isFinite(next.leadTimeHours) || next.leadTimeHours < 24 || next.leadTimeHours > 720) throw Object.assign(new Error('Lead time must be between 24 and 720 hours.'), { status: 400 });
  if (!Number.isFinite(next.heroIntervalSeconds) || next.heroIntervalSeconds < 5 || next.heroIntervalSeconds > 20) throw Object.assign(new Error('Slide interval must be between 5 and 20 seconds.'), { status: 400 });
  return next;
}

function parseBusinessClock(value) {
  const match = /^(\d{2}):(\d{2})$/.exec(String(value || ''));
  if (!match) return NaN;
  return Number(match[1]) * 60 + Number(match[2]);
}

function marylandLocalDateTime(dateValue, timeValue) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateValue || '')) || !/^(?:[01]\d|2[0-3]):(?:00|30)$/.test(String(timeValue || ''))) {
    throw Object.assign(new Error('Choose a valid date and a 30-minute pickup or delivery time.'), { status: 400 });
  }
  const [year, month, day] = dateValue.split('-').map(Number);
  const [hour, minute] = timeValue.split(':').map(Number);
  const baseGuess = Date.UTC(year, month - 1, day, hour, minute, 0);
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  });
  const localParts = date => Object.fromEntries(formatter.formatToParts(date).filter(part => part.type !== 'literal').map(part => [part.type, Number(part.value)]));
  let result = new Date(baseGuess);
  for (let iteration = 0; iteration < 2; iteration += 1) {
    const parts = localParts(result);
    const represented = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    result = new Date(result.getTime() + (baseGuess - represented));
  }
  const check = localParts(result);
  if (check.year !== year || check.month !== month || check.day !== day || check.hour !== hour || check.minute !== minute) {
    throw Object.assign(new Error('That date and time is not available in Maryland.'), { status: 400 });
  }
  return result;
}


const PICKUP_ADDRESS = '721 Fallsgrove Dr, Rockville, MD 20850';

function roundMoney(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function deliveryFeeFromMiles(miles) {
  const base = Number(db.settings.deliveryFee || 8.99);
  const included = Number(db.settings.deliveryIncludedMiles || 3);
  const perMile = Number(db.settings.deliveryPerMile || 1.5);
  return roundMoney(Math.max(base, base + Math.max(0, miles - included) * perMile));
}

function fallbackDistanceForZip(postalCode) {
  const zip = String(postalCode || '').slice(0,5);
  const local = new Set(['20850','20851','20852','20853','20854','20855','20877','20878','20879','20880','20882','20886']);
  if (local.has(zip)) return 5;
  const prefix = zip.slice(0,3);
  if (['208','209'].includes(prefix)) return 12;
  if (prefix === '207') return 22;
  return null;
}

async function quoteDelivery(address) {
  const clean = {
    line1: validateStreetAddress(address.line1),
    line2: String(address.line2 || '').trim().slice(0,120),
    city: validateCity(address.city),
    state: String(address.state || '').trim().toUpperCase(),
    postalCode: validateMarylandZip(address.postalCode)
  };
  if (clean.state !== 'MD') throw Object.assign(new Error('Delivery is limited to Maryland addresses.'), { status:400 });
  const destination = [clean.line1, clean.line2, clean.city, clean.state, clean.postalCode].filter(Boolean).join(', ');
  const apiKey = process.env.GOOGLE_ROUTES_API_KEY || process.env.GOOGLE_MAPS_SERVER_API_KEY || '';
  let distanceMiles = 0;
  let duration = '';
  let source = 'local-zone-estimate';

  if (apiKey) {
    try {
      const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'X-Goog-Api-Key':apiKey,
          'X-Goog-FieldMask':'routes.distanceMeters,routes.duration'
        },
        body:JSON.stringify({
          origin:{ address:PICKUP_ADDRESS },
          destination:{ address:destination },
          travelMode:'DRIVE',
          routingPreference:'TRAFFIC_UNAWARE',
          computeAlternativeRoutes:false,
          units:'IMPERIAL'
        })
      });
      const result = await response.json().catch(() => ({}));
      const route = result.routes?.[0];
      if (response.ok && route?.distanceMeters) {
        distanceMiles = Number(route.distanceMeters) / 1609.344;
        duration = String(route.duration || '');
        source = 'google-routes';
      }
    } catch {
      // Fall back to a ZIP-based local estimate when the route service is unavailable.
    }
  }

  if (!distanceMiles) distanceMiles = fallbackDistanceForZip(clean.postalCode);
  if (!distanceMiles) {
    throw Object.assign(new Error('A live delivery route quote is required for this Maryland address. Please choose pickup or contact Selly Bake House.'), { status:400 });
  }
  const maxMiles = Number(db.settings.deliveryMaxMiles || 35);
  if (distanceMiles > maxMiles + 0.01) {
    throw Object.assign(new Error(`This address is outside the current ${maxMiles}-mile delivery area. Please choose pickup or contact Selly Bake House.`), { status:400 });
  }
  return {
    fee:deliveryFeeFromMiles(distanceMiles),
    distanceMiles:Math.round(distanceMiles * 10) / 10,
    duration,
    source,
    origin:PICKUP_ADDRESS,
    destination
  };
}

async function validateOrder(order) {
  if (!db.settings.acceptingOrders) throw Object.assign(new Error('Online ordering is temporarily paused.'), { status: 409 });
  if (!order || !Array.isArray(order.items) || !order.items.length) throw Object.assign(new Error('At least one item is required.'), { status: 400 });
  const customer = order.customer || {};
  const firstName = validateName(customer.firstName, 'First name');
  const lastName = validateName(customer.lastName, 'Last name');
  const email = validateOptionalEmail(customer.email);
  const phone = validatePhone(customer.phone);

  const fulfillment = order.fulfillment || {};
  if (!['pickup','delivery'].includes(fulfillment.method)) throw Object.assign(new Error('Choose pickup or delivery.'), { status: 400 });
  const dateValue = String(fulfillment.date || '');
  const timeValue = String(fulfillment.time || '');
  const scheduled = marylandLocalDateTime(dateValue, timeValue);
  const cutoff = Date.now() + Number(db.settings.leadTimeHours) * 3600000;
  if (scheduled.getTime() < cutoff - 60000) throw Object.assign(new Error(`Orders require at least ${db.settings.leadTimeHours} hours' notice.`), { status: 400 });

  const [year, month, day] = dateValue.split('-').map(Number);
  const dayOfWeek = new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).getUTCDay();
  const weekend = dayOfWeek === 0 || dayOfWeek === 6;
  const selectedMinutes = parseBusinessClock(timeValue);
  const openingMinutes = parseBusinessClock(weekend ? db.settings.weekendStart : db.settings.weekdayStart);
  const closingMinutes = parseBusinessClock(weekend ? db.settings.weekendEnd : db.settings.weekdayEnd);
  if (selectedMinutes < openingMinutes || selectedMinutes > closingMinutes) {
    throw Object.assign(new Error('The selected time is outside the bakery pickup and delivery hours.'), { status: 400 });
  }

  const address = { ...(fulfillment.address || {}) };
  if (fulfillment.method === 'delivery') {
    address.line1 = validateStreetAddress(address.line1);
    address.line2 = String(address.line2 || '').trim().slice(0,120);
    address.city = validateCity(address.city);
    address.state = String(address.state || '').trim().toUpperCase();
    if (address.state !== 'MD') throw Object.assign(new Error('Delivery is limited to Maryland addresses.'), { status: 400 });
    address.postalCode = validateMarylandZip(address.postalCode);
  }

  let subtotal = 0;
  const cleanItems = order.items.map(item => {
    const productId = String(item.productId || '');
    const variantKey = String(item.variantKey || '');
    const quantity = Number(item.quantity);
    const unitPrice = PRODUCT_PRICES[productId]?.[variantKey];
    if (!unitPrice || !Number.isInteger(quantity) || quantity < 1 || quantity > 50) throw Object.assign(new Error('The cart contains an invalid item or quantity.'), { status: 400 });
    subtotal += unitPrice * quantity;
    return { productId, name: PRODUCT_NAMES[productId], variantKey, quantity, unitPrice, lineTotal: unitPrice * quantity };
  });
  const tipPercent = Number(order.tipPercent || 0);
  if (![0,10,15,20].includes(tipPercent)) throw Object.assign(new Error('Choose a valid tip option.'), { status: 400 });
  const customTip = Number(order.customTip || 0); if (!Number.isFinite(customTip) || customTip < 0 || customTip > 1000) throw Object.assign(new Error('Choose a valid custom tip.'), { status:400 });
  const tip = customTip > 0 ? Math.round(customTip * 100) / 100 : Math.round(subtotal * tipPercent) / 100;
  const deliveryQuote = fulfillment.method === 'delivery' ? await quoteDelivery(address) : null;
  const deliveryFee = deliveryQuote ? Number(deliveryQuote.fee) : 0;
  const tax = Math.round((subtotal + deliveryFee) * 0.06 * 100) / 100;
  const total = Math.round((subtotal + deliveryFee + tax + tip) * 100) / 100;
  return { customer: { firstName, lastName, email, phone }, fulfillment: { ...fulfillment, date: dateValue, time: timeValue, scheduledAtIso: scheduled.toISOString(), address, deliveryQuote }, items: cleanItems, subtotal, tipPercent, customTip, tip, deliveryFee, tax, total };
}

async function processSquarePayment(sourceId, idempotencyKey, validated) {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  const locationId = process.env.SQUARE_LOCATION_ID;
  const environment = String(process.env.SQUARE_ENVIRONMENT || 'sandbox').toLowerCase();
  if (!token || !locationId) throw Object.assign(new Error('Square server credentials are not configured.'), { status: 503 });
  const endpoint = environment === 'production' ? 'https://connect.squareup.com/v2/payments' : 'https://connect.squareupsandbox.com/v2/payments';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json', 'Square-Version': process.env.SQUARE_VERSION || '2026-07-15' },
    body: JSON.stringify({ source_id: sourceId, idempotency_key: idempotencyKey, amount_money: { amount: Math.round(validated.total * 100), currency: 'USD' }, location_id: locationId, note: `Selly Bake House online order for ${validated.customer.email || validated.customer.phone || `${validated.customer.firstName} ${validated.customer.lastName}`}` })
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.payment) {
    const message = result.errors?.map(error => error.detail || error.code).join(' ') || 'Square could not complete the payment.';
    throw Object.assign(new Error(message), { status: 502 });
  }
  return result.payment;
}

async function handleApi(req, res, url) {
  if (req.method === 'GET' && url.pathname === '/api/config') {
    return json(res, 200, {
      settings: db.settings,
      square: {
        environment: String(process.env.SQUARE_ENVIRONMENT || 'sandbox').toLowerCase(),
        applicationId: process.env.SQUARE_APPLICATION_ID || '',
        locationId: process.env.SQUARE_LOCATION_ID || '',
        paymentEndpoint: '/api/payments'
      }
    });
  }

  if (req.method === 'GET' && url.pathname === '/api/auth/me') {
    return json(res, 200, { user: publicUser(currentSession(req)?.user) });
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/register') {
    const body = await readJson(req);
    const name = String(body.name || '').trim().slice(0, 100);
    const email = validateEmail(body.email);
    const password = String(body.password || '');
    if (!name) throw Object.assign(new Error('Name is required.'), { status: 400 });
    if (password.length < 8) throw Object.assign(new Error('Password must contain at least eight characters.'), { status: 400 });
    if (db.users.some(user => user.email === email)) throw Object.assign(new Error('An account already exists for this email.'), { status: 409 });
    const user = { id: crypto.randomUUID(), name, email, passwordHash: hashPassword(password), role:'customer', createdAt:new Date().toISOString() };
    db.users.push(user);
    const token = crypto.randomBytes(32).toString('base64url');
    db.sessions.push({ token, userId:user.id, expiresAt:Date.now()+SESSION_DAYS*86400000 });
    await saveDb();
    return json(res, 201, { user: publicUser(user) }, { 'Set-Cookie': sessionCookie(token, SESSION_DAYS*86400) });
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    const body = await readJson(req);
    const email = validateEmail(body.email);
    const user = db.users.find(item => item.email === email);
    if (!user || !verifyPassword(String(body.password || ''), user.passwordHash)) throw Object.assign(new Error('Email or password is incorrect.'), { status: 401 });
    const token = crypto.randomBytes(32).toString('base64url');
    db.sessions.push({ token, userId:user.id, expiresAt:Date.now()+SESSION_DAYS*86400000 });
    await saveDb();
    return json(res, 200, { user: publicUser(user) }, { 'Set-Cookie': sessionCookie(token, SESSION_DAYS*86400) });
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/change-password') {
    const auth = currentSession(req);
    if (!auth) throw Object.assign(new Error('Sign in before changing your password.'), { status: 401 });
    const body = await readJson(req);
    const currentPassword = String(body.currentPassword || '');
    const newPassword = String(body.newPassword || '');
    if (!verifyPassword(currentPassword, auth.user.passwordHash)) throw Object.assign(new Error('Current password is incorrect.'), { status: 401 });
    if (newPassword.length < 10 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      throw Object.assign(new Error('New password must be at least 10 characters and include uppercase, lowercase, and a number.'), { status: 400 });
    }
    auth.user.passwordHash = hashPassword(newPassword);
    db.sessions = db.sessions.filter(session => session.userId !== auth.user.id || session.token === auth.session.token);
    await saveDb();
    return json(res, 200, { success: true });
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/logout') {
    const token = parseCookies(req).sbh_session;
    if (token) db.sessions = db.sessions.filter(item => item.token !== token);
    await saveDb();
    return json(res, 200, { success:true }, { 'Set-Cookie': sessionCookie('', 0) });
  }

  if (req.method === 'GET' && url.pathname === '/api/orders') {
    const auth = currentSession(req);
    if (!auth) throw Object.assign(new Error('Sign in to view orders.'), { status: 401 });
    const orders = auth.user.role === 'admin' ? db.orders : db.orders.filter(order => order.userId === auth.user.id || order.customer?.email === auth.user.email);
    return json(res, 200, { orders: orders.slice().reverse().map(order => ({ ...order, createdAtDisplay: new Date(order.createdAt).toLocaleString('en-US') })) });
  }

  if (req.method === 'PUT' && url.pathname === '/api/admin/settings') {
    requireAdmin(req);
    db.settings = validateSettings(await readJson(req));
    await saveDb();
    return json(res, 200, { settings: db.settings });
  }


  if (req.method === 'POST' && url.pathname === '/api/delivery-quote') {
    enforceRateLimit(req, 'delivery-quote', 60, 60 * 60 * 1000);
    const body = await readJson(req);
    const quote = await quoteDelivery(body.address || {});
    return json(res, 200, { success:true, quote });
  }

  if (req.method === 'POST' && url.pathname === '/api/orders/cash') {
    const body = await readJson(req); const validated = await validateOrder(body.order);
    if (validated.fulfillment.method !== 'pickup') throw Object.assign(new Error('Cash payment is available only for pickup.'), { status:400 });
    const auth=currentSession(req); const orderNumber=`SBH-${String(db.orders.length+1).padStart(5,'0')}`;
    const record={id:crypto.randomUUID(),orderNumber,userId:auth?.user?.id||null,status:'PENDING CASH',paymentMethod:'cash',createdAt:new Date().toISOString(),...validated}; db.orders.push(record); await saveDb();
    return json(res,200,{
      success:true,
      orderNumber,
      paymentStatus:'PENDING CASH',
      amounts:{ subtotal:validated.subtotal, delivery:validated.deliveryFee, tax:validated.tax, tip:validated.tip, total:validated.total },
      deliveryQuote:validated.fulfillment?.deliveryQuote || null
    });
  }

  if (req.method === 'POST' && url.pathname === '/api/custom-inquiries') {
    enforceRateLimit(req, 'custom-inquiry', 6, 60 * 60 * 1000);
    const body = await readJson(req);
    if (String(body.website || '').trim()) return json(res, 201, { success:true, requestNumber:'RECEIVED', imageCount:0 });

    const name = validateName(body.name);
    const phone = validatePhone(body.phone);
    const email = validateOptionalEmail(body.email);
    const date = validateFutureDate(body.date, 7);
    const details = String(body.details || '').trim().replace(/\s+/g, ' ').slice(0,3000);

    const requestNumber = `CUSTOM-${String(db.customInquiries.length + 1).padStart(5,'0')}`;
    const images = Array.isArray(body.images) ? body.images : [];
    if (images.length > 5) throw Object.assign(new Error('Attach no more than 5 reference images.'), { status:400 });

    const uploadDir = path.join(DATA_DIR,'custom-uploads',requestNumber);
    const savedImages = [];
    let totalBytes = 0;
    for (let index = 0; index < images.length; index += 1) {
      const image = images[index] || {};
      const data = String(image.data || '');
      const match = data.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
      if (!match) throw Object.assign(new Error('Use only JPG, PNG, or WebP reference images.'), { status:400 });
      const buffer = Buffer.from(match[2], 'base64');
      if (buffer.length > 5 * 1024 * 1024) throw Object.assign(new Error('Each reference image must be smaller than 5 MB.'), { status:400 });
      totalBytes += buffer.length;
      if (totalBytes > 20 * 1024 * 1024) throw Object.assign(new Error('The combined reference images are too large.'), { status:400 });
      const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
      await fsp.mkdir(uploadDir,{ recursive:true });
      const relative = path.join('custom-uploads',requestNumber,`reference-${String(index + 1).padStart(2,'0')}.${ext}`);
      await fsp.writeFile(path.join(DATA_DIR,relative),buffer,{ mode:0o600 });
      savedImages.push({ originalName:String(image.name || `reference-${index + 1}`).slice(0,180), savedPath:relative, size:buffer.length });
    }

    const record = {
      requestNumber, name, email, phone, date,
      occasion:String(body.occasion || '').trim().slice(0,80),
      servings:String(body.servings || '').trim().slice(0,20),
      flavor:String(body.flavor || '').trim().slice(0,80),
      budget:String(body.budget || '').trim().slice(0,80),
      details, savedImages, imageCount:savedImages.length,
      createdAt:new Date().toISOString(), status:'NEW', emailStatus:'PENDING_DEVELOPER_INTEGRATION'
    };
    db.customInquiries.push(record);
    await saveDb();
    return json(res,201,{ success:true, requestNumber, imageCount:savedImages.length });
  }

  if (req.method === 'POST' && url.pathname === '/api/payments') {
    const body = await readJson(req);
    const sourceId = String(body.sourceId || '');
    const idempotencyKey = String(body.idempotencyKey || crypto.randomUUID());
    if (!sourceId) throw Object.assign(new Error('Square payment source is missing.'), { status: 400 });
    const validated = await validateOrder(body.order);
    const payment = await processSquarePayment(sourceId, idempotencyKey, validated);
    if (String(payment.status || '').toUpperCase() !== 'COMPLETED') {
      throw Object.assign(new Error('Payment was not completed, so the order was not confirmed.'), { status: 402 });
    }
    const auth = currentSession(req);
    const orderNumber = `SBH-${String(db.orders.length + 1).padStart(5, '0')}`;
    const card = payment.card_details?.card || {};
    const paymentDetails = { cardBrand:String(card.card_brand || ''), last4:String(card.last_4 || '') };
    const record = { id:crypto.randomUUID(), orderNumber, userId:auth?.user?.id || null, squarePaymentId:payment.id, paymentMethod:'square', paymentDetails, receiptUrl:payment.receipt_url || '', status:payment.status || 'COMPLETED', createdAt:new Date().toISOString(), ...validated };
    db.orders.push(record);
    await saveDb();
    return json(res, 200, {
      success:true,
      orderNumber,
      receiptUrl:record.receiptUrl,
      paymentStatus:record.status,
      paymentDetails,
      amounts:{ subtotal:validated.subtotal, delivery:validated.deliveryFee, tax:validated.tax, tip:validated.tip, total:validated.total },
      deliveryQuote:validated.fulfillment?.deliveryQuote || null
    });
  }

  return json(res, 404, { message:'API endpoint not found.' });
}

const MIME = { '.html':'text/html; charset=utf-8', '.js':'application/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml', '.webp':'image/webp', '.ico':'image/x-icon', '.txt':'text/plain; charset=utf-8', '.json':'application/json; charset=utf-8', '.mp3':'audio/mpeg' };

async function serveStatic(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/') pathname = '/index.html';
  const candidate = path.resolve(ROOT, `.${pathname}`);
  if (!candidate.startsWith(ROOT) || candidate.startsWith(DATA_DIR)) return text(res, 403, 'Forbidden');
  try {
    const stat = await fsp.stat(candidate);
    if (!stat.isFile()) throw new Error('Not file');
    const data = await fsp.readFile(candidate);
    res.writeHead(200, { 'Content-Type': MIME[path.extname(candidate).toLowerCase()] || 'application/octet-stream', 'Content-Length': data.length, 'Cache-Control': path.basename(candidate) === 'index.html' ? 'no-cache' : 'public, max-age=3600' });
    res.end(data);
  } catch {
    if (!path.extname(pathname)) {
      const data = await fsp.readFile(path.join(ROOT, 'index.html'));
      res.writeHead(200, { 'Content-Type':'text/html; charset=utf-8', 'Content-Length':data.length, 'Cache-Control':'no-cache' });
      return res.end(data);
    }
    text(res, 404, 'Not found');
  }
}

async function requestHandler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    if (url.pathname.startsWith('/api/')) return await handleApi(req, res, url);
    return await serveStatic(req, res, url);
  } catch (error) {
    console.error(error);
    return json(res, Number(error.status || 500), { message: error.status ? error.message : 'The server encountered an unexpected error.' });
  }
}

loadDb().then(() => {
  http.createServer(requestHandler).listen(PORT, '0.0.0.0', () => {
    console.log(`Selly Bake House is running at http://localhost:${PORT}`);
    console.log('Open that address instead of opening index.html directly to use login, admin, address configuration, and Square checkout.');
  });
}).catch(error => { console.error(error); process.exit(1); });
