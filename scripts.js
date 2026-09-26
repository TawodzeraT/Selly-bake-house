(() => {
  'use strict';

  const STORE_CONFIG = {
    email: 'sellybakehouse@gmail.com',
    phone: '(301) 356-1232',
    announcement: 'Website Preview — Online ordering is coming soon',
    acceptingOrders: false,
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
    googleMapsApiKey: '',
    square: {
      environment: 'sandbox',
      applicationId: '',
      locationId: '',
      paymentEndpoint: '/api/payments'
    }
  };

const products = [
    {
      id: 'red-velvet-cookie', name: 'Red Velvet Cookie', category: 'Cookies', image: 'assets/images/products/red-velvet-cookie.png',
      description: 'A soft red velvet cookie with cream-colored chocolate pieces.', badge: 'Selly favorite',
      allergens: ['Eggs', 'Milk', 'Wheat'],
      variants: [{ key: '6-pack', label: 'Pack of 6', price: 24.99 }]
    },
    {
      id: 'classic-chocolate-chip-cookie', name: 'Classic Chocolate Chip', category: 'Cookies', image: 'assets/images/products/classic-chocolate-chip-cookie.png',
      description: 'Golden edges, a chewy center, and plenty of chocolate chips.', badge: 'Classic',
      allergens: ['Eggs', 'Milk', 'Wheat', 'Soy'],
      variants: [{ key: '6-pack', label: 'Pack of 6', price: 24.99 }]
    },
    {
      id: 'triple-chocolate-cookie', name: 'Triple Chocolate Cookie', category: 'Cookies', image: 'assets/images/products/triple-chocolate-cookie.png',
      description: 'Deep cocoa flavor for the serious chocolate lover.', badge: 'Chocolate lover',
      allergens: ['Eggs', 'Milk', 'Wheat', 'Soy'],
      variants: [{ key: '6-pack', label: 'Pack of 6', price: 24.99 }]
    },
    {
      id: 'nutella-bueno-cookie', name: 'Nutella Bueno Cookie', category: 'Cookies', image: 'assets/images/products/nutella-bueno-cookie.png',
      description: 'A generous cookie with a chocolate-hazelnut finish.', badge: 'Popular',
      allergens: ['Eggs', 'Milk', 'Wheat', 'Soy', 'Nuts'],
      variants: [{ key: '6-pack', label: 'Pack of 6', price: 24.99 }]
    },
    {
      id: 'biscoff-cookie', name: 'Biscoff Cookie', category: 'Cookies', image: 'assets/images/products/biscoff-cookie.png',
      description: 'Warm spiced-cookie flavor with a sweet caramelized note.', badge: 'Cozy favorite',
      allergens: ['Eggs', 'Milk', 'Wheat', 'Soy'],
      variants: [{ key: '6-pack', label: 'Pack of 6', price: 24.99 }]
    },
    {
      id: 'birthday-cookie', name: 'Birthday Cookie', category: 'Cookies', image: 'assets/images/products/birthday-cookie.png',
      description: 'A celebratory cookie filled with colorful birthday energy.', badge: 'Celebration',
      allergens: ['Eggs', 'Milk', 'Wheat', 'Soy'],
      variants: [{ key: '6-pack', label: 'Pack of 6', price: 24.99 }]
    },
    {
      id: 'vanilla-cupcake', name: 'Vanilla Cupcakes', category: 'Cupcakes', image: 'assets/images/products/vanilla-cupcake.png',
      description: 'Tender vanilla cupcakes topped with smooth buttercream.', badge: 'Classic',
      allergens: ['Eggs', 'Milk', 'Wheat'],
      variants: [{ key: '6-pack', label: 'Pack of 6', price: 21.99 }]
    },
    {
      id: 'red-velvet-cupcake', name: 'Red Velvet Cupcakes', category: 'Cupcakes', image: 'assets/images/products/red-velvet-cupcake.png',
      description: 'Velvety cocoa cupcakes with a generous frosting swirl.', badge: 'Best seller',
      allergens: ['Eggs', 'Milk', 'Wheat'],
      variants: [{ key: '6-pack', label: 'Pack of 6', price: 21.99 }]
    },
    {
      id: 'chocolate-cupcake', name: 'Chocolate Cupcakes', category: 'Cupcakes', image: 'assets/images/products/chocolate-cupcake.png',
      description: 'Moist chocolate cupcakes finished with creamy frosting.', badge: 'Rich & dreamy',
      allergens: ['Eggs', 'Milk', 'Wheat', 'Soy'],
      variants: [{ key: '6-pack', label: 'Pack of 6', price: 21.99 }]
    },
    {
      id: 'vanilla-cake', name: 'Vanilla Cake', category: 'Cakes', image: 'assets/images/products/vanilla-cake-v6.png',
      description: 'Tender vanilla layers with a smooth, classic finish.', badge: 'Celebration',
      allergens: ['Eggs', 'Milk', 'Wheat'],
      variants: [
        { key: '6-inch', label: '6 inch · serves 8–10', price: 46.99 },
        { key: '8-inch', label: '8 inch · serves 12–16', price: 72.99 },
        { key: '10-inch', label: '10 inch · serves 20–28', price: 97.99 }
      ]
    },
    {
      id: 'red-velvet-cake', name: 'Red Velvet Cake', category: 'Cakes', image: 'assets/images/products/red-velvet-cake.png',
      description: 'Red velvet layers paired with a smooth cream filling.', badge: 'Selly favorite',
      allergens: ['Eggs', 'Milk', 'Wheat'],
      variants: [
        { key: '6-inch', label: '6 inch · serves 8–10', price: 46.99 },
        { key: '8-inch', label: '8 inch · serves 12–16', price: 72.99 },
        { key: '10-inch', label: '10 inch · serves 20–28', price: 97.99 }
      ]
    },
    {
      id: 'chocolate-cake', name: 'Chocolate Cake', category: 'Cakes', image: 'assets/images/products/chocolate-cake-v6.png',
      description: 'Chocolate layers with a rich, indulgent chocolate finish.', badge: 'Chocolate lover',
      allergens: ['Eggs', 'Milk', 'Wheat', 'Soy'],
      variants: [
        { key: '6-inch', label: '6 inch · serves 8–10', price: 46.99 },
        { key: '8-inch', label: '8 inch · serves 12–16', price: 72.99 },
        { key: '10-inch', label: '10 inch · serves 20–28', price: 97.99 }
      ]
    }
  ];;

  const galleryItems = [
    { src: 'assets/images/gallery/148512275_242189930728240_6591717490584623464_n.png', title: 'Frozen princess birthday cake', category: 'Cakes' },
    { src: 'assets/images/gallery/206868586_333522254928340_1667649230012949580_n.png', title: 'Construction-themed celebration cake', category: 'Cakes' },
    { src: 'assets/images/gallery/206922283_333522354928330_6311362397672409482_n.jpg', title: 'Princess birthday cake', category: 'Cakes' },
    { src: 'assets/images/gallery/207681141_333522448261654_7658232247172407275_n.jpg', title: 'Chevron celebration cake', category: 'Cakes' },
    { src: 'assets/images/gallery/212256574_333522488261650_7507453098268731078_n.jpg', title: 'Confetti cupcake collection', category: 'Cupcakes' },
    { src: 'assets/images/gallery/457866563_1051739470289294_2124074058508560799_n.jpg', title: 'Pastel floral celebration cake', category: 'Cakes' },
    { src: 'assets/images/gallery/481664476_1194561916007048_2795095807665151521_n.jpg', title: 'Chocolate drip celebration cake', category: 'Cakes' },
    { src: 'assets/images/gallery/492217872_1243644841098755_4139112640717575519_n.jpg', title: 'Decorated spring cookie box', category: 'Cookies & Bars' },
    { src: 'assets/images/gallery/492457081_1243644857765420_7012776816389425731_n.jpg', title: 'Frozen-themed celebration cake', category: 'Cakes' },
    { src: 'assets/images/gallery/492529015_1243644614432111_1068990911912211271_n.jpg', title: 'Chocolate strawberry treat box', category: 'Treat Boxes' },
    { src: 'assets/images/gallery/492610661_1243644674432105_9038565680943108866_n.jpg', title: 'Decorated cake-pop treats', category: 'Treat Boxes' },
    { src: 'assets/images/gallery/492672891_1243644804432092_6499794562727696959_n.jpg', title: 'Assorted dessert cups', category: 'Treat Boxes' },
    { src: 'assets/images/gallery/492703479_1243644701098769_347810915218102520_n.jpg', title: 'Rose and strawberry dessert assortment', category: 'Treat Boxes' },
    { src: 'assets/images/gallery/492851303_1243644724432100_6013952039155389485_n.jpg', title: 'White chocolate strawberry box', category: 'Treat Boxes' },
    { src: 'assets/images/gallery/492889379_1243644847765421_6251020034130147721_n.jpg', title: 'Elegant birthday cake', category: 'Cakes' },
    { src: 'assets/images/gallery/492949874_1246478777482028_3409757893029273269_n.jpg', title: 'Christmas cake and cupcake set', category: 'Treat Boxes' },
    { src: 'assets/images/gallery/493046074_1246478790815360_5763292936754769564_n.jpg', title: 'Holiday cake gift box', category: 'Treat Boxes' },
    { src: 'assets/images/gallery/493140481_1246478747482031_2722734733885947565_n.jpg', title: 'Holiday buttercream cupcakes', category: 'Cupcakes' },
    { src: 'assets/images/gallery/493223041_1246478820815357_1751787059945629517_n.jpg', title: 'Christmas cake gift set', category: 'Treat Boxes' },
    { src: 'assets/images/gallery/493263601_1246478764148696_741314042067444084_n.jpg', title: 'Green Christmas cake and cupcakes', category: 'Treat Boxes' },
    { src: 'assets/images/gallery/493276667_1246478804148692_2596808856437547247_n.jpg', title: 'Holiday cake and cupcake collection', category: 'Treat Boxes' },
    { src: 'assets/images/gallery/493280447_1246620687467837_9182626430683552019_n.jpg', title: 'Peppa Pig birthday cake', category: 'Cakes' },
    { src: 'assets/images/gallery/493315768_1243644624432110_2416082726145323149_n.jpg', title: 'Rose and strawberry party boxes', category: 'Treat Boxes' },
    { src: 'assets/images/gallery/493543084_1243644467765459_6321803058568423189_n.jpg', title: 'Assorted dessert cup collection', category: 'Treat Boxes' },
    { src: 'assets/images/gallery/493731600_1243644364432136_4136628607714527678_n.jpg', title: 'Pastel strawberry treat box', category: 'Treat Boxes' },
    { src: 'assets/images/gallery/494086503_1246620990801140_3775748658902732559_n.jpg', title: 'Peppa Pig celebration cake', category: 'Cakes' },
    { src: 'assets/images/gallery/603798715_1457529816376922_6193874370125038807_n.jpg', title: 'Peppa Pig second birthday cake', category: 'Cakes' },
    { src: 'assets/images/gallery/603808162_1457535563043014_7144467637602283518_n.jpg', title: 'Frosted brownie tray', category: 'Cookies & Bars' },
    { src: 'assets/images/gallery/603854439_1457535549709682_4523387339495499587_n.jpg', title: 'Confetti sheet cake', category: 'Cakes' },
    { src: 'assets/images/gallery/603857199_1457535436376360_4909003375901606891_n.jpg', title: 'Chocolate hazelnut cookie', category: 'Cookies & Bars' },
    { src: 'assets/images/gallery/603874366_1457534783043092_1157193079171987442_n.jpg', title: 'Bluey celebration cake', category: 'Cakes' },
    { src: 'assets/images/gallery/603898277_1457530073043563_4953058222303544837_n.jpg', title: 'Assorted cookie collection', category: 'Cookies & Bars' },

    { src: 'assets/images/gallery/new-2026/chocolate-cupcake-tray.webp', title: 'Blue birthday cake for Dad', category: 'Cakes' },
    { src: 'assets/images/gallery/new-2026/chocolate-mini-cupcakes.webp', title: 'Assorted mini cupcake tray', category: 'Cupcakes' },
    { src: 'assets/images/gallery/new-2026/cupcake-party-tray.webp', title: 'Minecraft birthday cake', category: 'Cakes' },
    { src: 'assets/images/gallery/new-2026/cupcake-variety-tray.webp', title: 'Gold floral birthday cake', category: 'Cakes' },
    { src: 'assets/images/gallery/new-2026/dad-birthday-cake.webp', title: 'Chocolate mini cupcakes with pearl details', category: 'Cupcakes' },
    { src: 'assets/images/gallery/new-2026/floral-watercolor-cake.webp', title: 'Vanilla confetti mini cupcakes', category: 'Cupcakes' },
    { src: 'assets/images/gallery/new-2026/graduation-cake.webp', title: 'Red velvet cupcakes with pearl details', category: 'Cupcakes' },
    { src: 'assets/images/gallery/new-2026/holiday-cupcake-box.webp', title: 'White and gold floral cake', category: 'Cakes' },
    { src: 'assets/images/gallery/new-2026/holiday-cupcake-closeup.webp', title: 'Red velvet mini cupcake', category: 'Cupcakes' },
    { src: 'assets/images/gallery/new-2026/holiday-cupcakes-six.webp', title: 'Red velvet layer cake close-up', category: 'Cakes' },
    { src: 'assets/images/gallery/new-2026/minecraft-cake.webp', title: 'Mini cupcake table display', category: 'Cupcakes' },
    { src: 'assets/images/gallery/new-2026/mini-cupcake-assortment.webp', title: 'Chocolate mini cupcakes', category: 'Cupcakes' },
    { src: 'assets/images/gallery/new-2026/red-velvet-cake-bites.webp', title: 'Black, white, and gold graduation cake', category: 'Cakes' },
    { src: 'assets/images/gallery/new-2026/red-velvet-layer-closeup.webp', title: 'Red velvet cake bites', category: 'Cookies & Bars' },
    { src: 'assets/images/gallery/new-2026/red-velvet-mini-cupcake.webp', title: 'Holiday cupcake close-up', category: 'Cupcakes' },
    { src: 'assets/images/gallery/new-2026/vanilla-confetti-mini-cupcakes.webp', title: 'Pink watercolor floral cake', category: 'Cakes' },

    { src: 'assets/images/gallery/new-2026-07/holiday-cupcakes-six-v2.webp', title: 'Holiday cupcakes with festive sprinkles', category: 'Cupcakes' },
    { src: 'assets/images/gallery/new-2026-07/cake-slice-assortment.webp', title: 'Vanilla and chocolate cake slice assortment', category: 'Cookies & Bars' },
    { src: 'assets/images/gallery/new-2026-07/pink-flower-cookie.webp', title: 'Pink flower decorated cookie', category: 'Cookies & Bars' },
    { src: 'assets/images/gallery/new-2026-07/pink-cookie-cakepop-gift-boxes.webp', title: 'Pink cookie and cake-pop gift boxes', category: 'Treat Boxes' },
    { src: 'assets/images/gallery/new-2026-07/pink-cake-pop-gift-box.webp', title: 'Pink cake-pop gift box', category: 'Treat Boxes' },
    { src: 'assets/images/gallery/new-2026-07/red-velvet-dessert-loaf.webp', title: 'Red velvet dessert loaf', category: 'Cookies & Bars' },
    { src: 'assets/images/gallery/new-2026-07/cookies-cream-dessert-loaf.webp', title: 'Cookies-and-cream dessert loaf', category: 'Cookies & Bars' },
    { src: 'assets/images/gallery/new-2026-07/confetti-dessert-loaf.webp', title: 'Vanilla confetti dessert loaf', category: 'Cookies & Bars' },
    { src: 'assets/images/gallery/new-2026-07/grey-gold-birthday-cake.webp', title: 'Grey and gold birthday cake', category: 'Cakes' },
    { src: 'assets/images/gallery/new-2026-07/pink-coral-birthday-cake.webp', title: 'Pink and coral buttercream birthday cake', category: 'Cakes' },
    { src: 'assets/images/gallery/new-2026-07/holiday-wreath-cake.webp', title: 'Holiday wreath buttercream cake', category: 'Cakes' }
  ].map(item => ({ ...item, source: 'Selly Bake House' }));

  const heroSlides = [
    {
      image: 'assets/images/gallery/603898277_1457530073043563_4953058222303544837_n.jpg',
      alt: 'Assorted Selly Bake House cookies', kicker: 'Fresh from the oven',
      title: 'Cookies made for <em>sharing—or not.</em>',
      copy: 'Choose a box of handcrafted cookies for gifts, gatherings, celebrations, or a well-earned treat at home.',
      primary: { label: 'Shop Cookie Boxes', route: 'shop' }, secondary: { label: 'See the Gallery', route: 'gallery' },
      trust: ['Made to order', 'Boxed with care', 'Rockville pickup'], card: ['Cookie collection', 'A flavor for every craving', 'Freshly baked and ready to share.']
    },
    {
      image: 'assets/images/gallery/new-2026-07/holiday-cupcakes-six-v2.webp',
      alt: 'Festive Selly Bake House cupcakes', kicker: 'Cupcake boxes',
      title: 'Small treats with <em>big celebration energy.</em>',
      copy: 'Cupcake boxes bring easy sweetness to birthdays, office gatherings, showers, and weekend moments.',
      primary: { label: 'Shop Cupcakes', route: 'shop' }, secondary: { label: 'Plan a Custom Order', route: 'custom' },
      trust: ['Six-count boxes', 'Fresh buttercream', 'Celebration ready'], card: ['Cupcake favorite', 'Beautifully piped', 'Perfect for sharing with a crowd.']
    },
    {
      image: 'assets/images/gallery/457866563_1051739470289294_2124074058508560799_n.jpg',
      alt: 'Pastel floral celebration cake', kicker: 'Custom celebrations',
      title: 'Your vision, <em>turned into cake.</em>',
      copy: 'Share your occasion, colors, servings, and inspiration. We will help shape a custom cake that feels personal.',
      primary: { label: 'Start a Cake Inquiry', route: 'custom' }, secondary: { label: 'Browse Cake Inspiration', route: 'gallery' },
      trust: ['Custom designs', 'Multiple sizes', 'Personal details'], card: ['Custom cakes', 'Designed for your moment', 'Birthdays, showers, weddings, and milestones.']
    },
    {
      image: 'assets/images/gallery/493315768_1243644624432110_2416082726145323149_n.jpg',
      alt: 'Rose and strawberry dessert boxes', kicker: 'Dessert boxes',
      title: 'A whole box of <em>something special.</em>',
      copy: 'Mix elegant cupcakes, dipped strawberries, dessert cups, and other toothsome favorites for memorable gifting.',
      primary: { label: 'Explore Treats', route: 'shop' }, secondary: { label: 'Ask About a Custom Box', route: 'custom' },
      trust: ['Giftable', 'Event friendly', 'Made locally'], card: ['Party-ready boxes', 'Sweet variety', 'A beautiful option for guests and gifts.']
    },
    {
      image: 'assets/images/gallery/603798715_1457529816376922_6193874370125038807_n.jpg',
      alt: 'Peppa Pig second birthday cake', kicker: 'Birthday magic',
      title: 'Make their favorite theme <em>the center of the party.</em>',
      copy: 'Character-inspired and themed cakes can bring extra joy to milestone birthdays and family celebrations.',
      primary: { label: 'Plan a Birthday Cake', route: 'custom' }, secondary: { label: 'View More Cakes', route: 'gallery' },
      trust: ['Themed designs', 'Personal messages', 'Photo inspiration welcome'], card: ['Birthday spotlight', 'Made for the guest of honor', 'Share your colors, theme, and serving needs.']
    },
    {
      image: 'assets/images/gallery/492949874_1246478777482028_3409757893029273269_n.jpg',
      alt: 'Christmas cake and cupcake gift set', kicker: 'Seasonal specials',
      title: 'Celebrate the season with <em>limited sweet releases.</em>',
      copy: 'Holiday boxes and seasonal designs will appear here as they become available. Follow Facebook for the newest updates.',
      primary: { label: 'Follow on Facebook', href: 'https://www.facebook.com/sellybakehouse/' }, secondary: { label: 'Browse the Gallery', route: 'gallery' },
      trust: ['Limited releases', 'Holiday gifting', 'Community updates'], card: ['Seasonal collection', 'Follow for new drops', 'Stay close to upcoming specials and events.']
    },
    {
      image: 'assets/images/gallery/603854439_1457535549709682_4523387339495499587_n.jpg',
      alt: 'Confetti sheet cake', kicker: 'Easy crowd serving',
      title: 'Sheet cakes built for <em>happy, hungry guests.</em>',
      copy: 'A practical celebration option when you want generous servings, bright decoration, and an easy-to-share centerpiece.',
      primary: { label: 'Request a Sheet Cake', route: 'custom' }, secondary: { label: 'See Cake Styles', route: 'gallery' },
      trust: ['Crowd friendly', 'Custom colors', 'Celebration messages'], card: ['Party favorite', 'Simple to serve', 'Great for birthdays, teams, and gatherings.']
    },
    {
      image: 'assets/images/gallery/603874366_1457534783043092_1157193079171987442_n.jpg',
      alt: 'Bluey celebration cake', kicker: 'Made for memorable moments',
      title: 'A cake they will <em>talk about after the candles.</em>',
      copy: 'Bring your inspiration and let Selly Bake House create a centerpiece that feels fun, personal, and celebration ready.',
      primary: { label: 'Start Your Inquiry', route: 'custom' }, secondary: { label: 'See Recent Work', route: 'gallery' },
      trust: ['Creative details', 'Personalized themes', 'Made in Maryland'], card: ['Recent creation', 'Colorful and playful', 'Designed around the celebration theme.']
    },
    {
      image: 'assets/images/gallery/492529015_1243644614432111_1068990911912211271_n.jpg',
      alt: 'Chocolate strawberry treat box', kicker: 'Thoughtful gifting',
      title: 'Send something <em>beautifully toothsome.</em>',
      copy: 'Dessert boxes can turn thank-yous, congratulations, birthdays, and just-because moments into something memorable.',
      primary: { label: 'Shop Fresh Treats', route: 'shop' }, secondary: { label: 'Contact the Bakery', href: 'mailto:sellybakehouse@gmail.com' },
      trust: ['Gift worthy', 'Locally prepared', 'Personal touches'], card: ['Sweet gifting', 'A box full of joy', 'Perfect for celebrating someone special.']
    }
  ];

  const CART_KEY = 'selly-bake-house-cart-v6';
  const CONFIRMATION_KEY = 'selly-bake-house-last-confirmation-v1';
  const CUSTOM_CONFIRMATION_KEY = 'selly-bake-house-last-custom-request-v1';
  const state = {
    route: 'home', productFilter: 'All', productSearch: '', galleryFilter: 'All',
    cart: loadCart(), fulfillment: 'pickup', tipPercent: 0, customTip: 0, paymentMethod: 'square', heroIndex: 0, heroTimer: null, heroPaused: false,
    card: null, squarePayments: null, squareReady: false, processing: false,
    user: null, orders: [], apiAvailable: true, addressVerified: false, googleAutocomplete: null, deliveryQuote: null, deliveryQuoteKey: '', deliveryQuoteLoading: false,
    confetti: null, memoryTimer: null, memoryCycle: 0, galleryMusicWanted: true, galleryMusicPlaying: false,
    lastConfirmation: loadConfirmation(), lastCustomConfirmation: loadCustomConfirmation(), customFiles: [], lightboxIndex: -1,
    previewProductId: '', previewVariantKey: ''
  };

  const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value || 0));
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[char]));

  function loadConfirmation() {
    try { const parsed = JSON.parse(sessionStorage.getItem(CONFIRMATION_KEY) || 'null'); return parsed && typeof parsed === 'object' ? parsed : null; }
    catch { return null; }
  }
  function saveConfirmation(value) {
    state.lastConfirmation = value;
    try { sessionStorage.setItem(CONFIRMATION_KEY, JSON.stringify(value)); } catch {}
  }
  function loadCustomConfirmation() {
    try { const parsed = JSON.parse(sessionStorage.getItem(CUSTOM_CONFIRMATION_KEY) || 'null'); return parsed && typeof parsed === 'object' ? parsed : null; }
    catch { return null; }
  }
  function saveCustomConfirmation(value) {
    state.lastCustomConfirmation = value;
    try { sessionStorage.setItem(CUSTOM_CONFIRMATION_KEY, JSON.stringify(value)); } catch {}
  }

  function loadCart() {
    try { const parsed = JSON.parse(localStorage.getItem(CART_KEY) || '[]'); return Array.isArray(parsed) ? parsed : []; }
    catch { return []; }
  }
  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(state.cart)); } catch {}
    renderCart(); renderCheckout(); refreshProductCardQuantities();
    if (document.getElementById('productPreviewModal')?.classList.contains('open')) refreshProductPreviewActions();
  }
  function getProduct(id) { return products.find(product => product.id === id); }
  function getVariant(product, key) { return product?.variants.find(variant => variant.key === key) || product?.variants[0]; }
  function cartDetails() {
    return state.cart.map(item => {
      const product = getProduct(item.productId); const variant = getVariant(product, item.variantKey);
      return product && variant ? { ...item, product, variant, lineTotal: variant.price * item.quantity } : null;
    }).filter(Boolean);
  }
  function cartCount() { return state.cart.reduce((sum, item) => sum + item.quantity, 0); }
  function subtotal() { return cartDetails().reduce((sum, item) => sum + item.lineTotal, 0); }
  function deliveryFee() {
    if (state.fulfillment !== 'delivery') return 0;
    return Number(state.deliveryQuote?.fee || 0);
  }
  function tipAmount() { return state.customTip > 0 ? state.customTip : subtotal() * (state.tipPercent / 100); }
  function taxAmount() { return Math.round((subtotal() + deliveryFee()) * 0.06 * 100) / 100; }
  function total() { return subtotal() + deliveryFee() + taxAmount() + tipAmount(); }

  async function api(path, options = {}) {
    const response = await fetch(path, {
      credentials: 'same-origin',
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.message || `Request failed (${response.status})`);
    return payload;
  }

  async function loadPublicConfig() {
    try {
      const data = await api('/api/config', { method: 'GET', headers: {} });
      Object.assign(STORE_CONFIG, data.settings || {});
      STORE_CONFIG.square = { ...STORE_CONFIG.square, ...(data.square || {}) };
      state.apiAvailable = true;
    } catch {
      state.apiAvailable = false;
    }
    applyPublicSettings();
  }

  function applyPublicSettings() {
    document.getElementById('promoAnnouncement').textContent = STORE_CONFIG.announcement || 'Freshly baked in Rockville, Maryland';
    document.body.classList.toggle('preview-mode', !STORE_CONFIG.acceptingOrders);
    const note = document.getElementById('leadTimeNote');
    if (note) {
      const leadHours = Math.max(24, Number(STORE_CONFIG.leadTimeHours || 24));
      note.textContent = leadHours === 24 ? '24-hour notice required for all orders.' : `${leadHours}-hour notice required for all orders.`;
    }
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
      if (!link.href.includes('subject=')) link.href = `mailto:${STORE_CONFIG.email}`;
    });
    document.querySelectorAll('a[href^="tel:"]').forEach(link => { link.textContent = STORE_CONFIG.phone; });
    setMinimumDates();
    populateTimeOptions();
    restartHeroTimer();
    maybeLoadGooglePlaces();
  }

  function safeRoute(value) {
  const route = [
    'home',
    'shop',
    'custom',
    'gallery',
    'about',
    'account',
    'admin',
    'checkout',
    'confirmation',
    'custom-confirmation'
  ].includes(value) ? value : 'home';

  if (
    !STORE_CONFIG.acceptingOrders &&
    ['checkout', 'confirmation', 'custom-confirmation'].includes(route)
  ) {
    return 'shop';
  }

  return route;
  }
  function navigate(route, { replace = false } = {}) {
    const next = safeRoute(route); const hash = `#${next}`;
    if (replace) history.replaceState(null, '', hash);
    else if (location.hash !== hash) history.pushState(null, '', hash);
    showRoute(next);
  }
  function showRoute(route) {
    state.route = safeRoute(route);
    document.querySelectorAll('[data-view]').forEach(view => { view.hidden = view.dataset.view !== state.route; });
    document.querySelectorAll('.nav-link[data-route]').forEach(link => link.classList.toggle('active', link.dataset.route === state.route));
    document.getElementById('headerNav')?.classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.title = routeTitle(state.route);
    state.confetti?.setRoute(state.route);
    stopMemoryWall();
    if (!['gallery','about'].includes(state.route)) pauseGalleryMusic();
    else if (state.galleryMusicWanted) startGalleryMusic();
    if (state.route === 'custom') { setCustomDateMinimum(); startCustomCakeRotation(); }
    else stopCustomCakeRotation();
    if (state.route === 'checkout') { renderCheckout(); initSquarePayment(); }
    if (state.route === 'confirmation') renderConfirmation();
    if (state.route === 'custom-confirmation') renderCustomConfirmation();
    if (state.route === 'account') { renderAccount(); loadOrders(); }
    if (state.route === 'admin') renderAdmin();
  }
  function routeTitle(route) {
    const titles = {
      home: 'Selly Bake House | Home of Everything Toothsome', shop: 'Shop | Selly Bake House',
      custom: 'Custom Cakes | Selly Bake House', gallery: 'Gallery | Selly Bake House', about: 'About | Selly Bake House',
      account: 'Customer Account | Selly Bake House', admin: 'Admin | Selly Bake House', checkout: 'Secure Checkout | Selly Bake House',
      confirmation: 'Order Confirmed | Selly Bake House', 'custom-confirmation': 'Custom Cake Request Received | Selly Bake House'
    };
    return titles[route] || titles.home;
  }

  function actionMarkup(action, primary = false) {
    const cls = primary ? 'button' : 'button secondary';
    if (action.route) return `<button class="${cls}" type="button" data-route="${escapeHtml(action.route)}">${escapeHtml(action.label)}${primary ? ' <span>→</span>' : ''}</button>`;
    return `<a class="${cls}" href="${escapeHtml(action.href)}"${action.href.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${escapeHtml(action.label)}${primary ? ' <span>→</span>' : ''}</a>`;
  }
  function renderHeroSlides() {
    const slides = document.getElementById('heroSlides'); const dots = document.getElementById('heroDots');
    if (!slides || !dots) return;
    slides.innerHTML = heroSlides.map((slide, index) => `
      <article class="hero-slide${index === 0 ? ' active' : ''}" data-slide="${index}">
        <div class="hero-copy">
          <span class="hero-kicker">${slide.kicker}</span><h1>${slide.title}</h1><p>${slide.copy}</p>
          <div class="hero-actions">${actionMarkup(slide.primary, true)}${actionMarkup(slide.secondary, false)}</div>
          <div class="hero-trust">${slide.trust.map(item => `<span>${escapeHtml(item)}</span>`).join('')}</div>
        </div>
        <div class="hero-visual"><img src="${slide.image}" alt="${escapeHtml(slide.alt)}"${index === 0 ? ' fetchpriority="high"' : ' loading="lazy"'}>
          <div class="hero-card"><small>${escapeHtml(slide.card[0])}</small><strong>${escapeHtml(slide.card[1])}</strong><span>${escapeHtml(slide.card[2])}</span></div>
        </div>
      </article>`).join('');
    dots.innerHTML = heroSlides.map((_, index) => `<button class="hero-dot${index === 0 ? ' active' : ''}" type="button" data-slide-to="${index}" aria-label="Show slide ${index + 1}"></button>`).join('');
    state.heroIndex = 0;
  }
  function setHeroSlide(index, manual = false) {
    const slides = [...document.querySelectorAll('[data-slide]')]; const dots = [...document.querySelectorAll('[data-slide-to]')];
    if (!slides.length) return;
    const next = (index + slides.length) % slides.length; const current = state.heroIndex;
    if (current === next && slides[next].classList.contains('active')) return;
    slides[current]?.classList.add('leaving'); slides[current]?.classList.remove('active');
    slides[next].classList.remove('leaving'); slides[next].classList.add('active');
    dots.forEach((dot, i) => dot.classList.toggle('active', i === next)); state.heroIndex = next;
    window.setTimeout(() => slides[current]?.classList.remove('leaving'), 850);
    if (manual) restartHeroTimer();
  }
  function updateHeroPauseButton() {
    const button = document.querySelector('[data-slide-toggle]');
    if (!button) return;
    button.setAttribute('aria-pressed', state.heroPaused ? 'true' : 'false');
    button.setAttribute('aria-label', state.heroPaused ? 'Resume home slideshow' : 'Pause home slideshow');
    button.title = state.heroPaused ? 'Resume slideshow' : 'Pause slideshow';
    button.textContent = state.heroPaused ? '▶' : '❚❚';
  }
  function startHeroTimer() {
    stopHeroTimer();
    if (state.heroPaused) { updateHeroPauseButton(); return; }
    const seconds = Math.max(3, Number(STORE_CONFIG.heroIntervalSeconds || 5));
    state.heroTimer = window.setInterval(() => setHeroSlide(state.heroIndex + 1), seconds * 1000);
    updateHeroPauseButton();
  }
  function stopHeroTimer() { if (state.heroTimer) window.clearInterval(state.heroTimer); state.heroTimer = null; }
  function restartHeroTimer() { if (document.getElementById('heroSlides')?.children.length) startHeroTimer(); }
  function toggleHeroTimer() {
    state.heroPaused = !state.heroPaused;
    if (state.heroPaused) stopHeroTimer(); else startHeroTimer();
    updateHeroPauseButton();
  }

  function cartQuantityFor(productId, variantKey) {
    return Number(state.cart.find(item => item.productId === productId && item.variantKey === variantKey)?.quantity || 0);
  }
  function productActionMarkup(product, variantKey) {
    if (!STORE_CONFIG.acceptingOrders) {
      return `<button class="button small" type="button" disabled aria-disabled="true">Ordering Coming Soon</button>`;
    }
    if (product.category === 'Cakes' && product.variants.length > 1 && !variantKey) {
      return `<button class="button small" type="button" disabled aria-disabled="true">Choose size</button>`;
    }
    const quantity = cartQuantityFor(product.id, variantKey);
    if (!quantity) return `<button class="button small" type="button" data-add-product="${product.id}">Add</button>`;
    return `<div class="product-card-quantity" aria-label="${escapeHtml(product.name)} quantity in cart">
      <button type="button" data-product-step="${product.id}" data-delta="-1" aria-label="Decrease ${escapeHtml(product.name)} quantity">−</button>
      <strong>${quantity}</strong>
      <button type="button" data-product-step="${product.id}" data-delta="1" aria-label="Increase ${escapeHtml(product.name)} quantity">+</button>
    </div>`;
  }
  function variantServingRange(variant) {
    const match = String(variant?.label || '').match(/serves\s+([^·]+)/i);
    return match ? match[1].trim() : '';
  }
  function variantServingText(variant) {
    const range = variantServingRange(variant);
    return range ? `Serves approx. ${range}` : '';
  }
  function variantSizeText(variant) {
    return String(variant?.label || '').split(' · ')[0].trim();
  }
  function cakeVariantTabs(product) {
    return `<div class="cake-size-options" role="group" aria-label="Choose a cake size for ${escapeHtml(product.name)}">
      ${product.variants.map(variant => `<button class="cake-size-tab" type="button" data-cake-variant="${escapeHtml(product.id)}" data-variant-key="${escapeHtml(variant.key)}" aria-pressed="false"><span class="cake-size-label">${escapeHtml(variantSizeText(variant))}</span><span class="cake-serves-label">${escapeHtml(variantServingText(variant))}</span></button>`).join('')}
      <input class="variant-value" type="hidden" data-variant-select="${escapeHtml(product.id)}" value="">
    </div>`;
  }
  function productCardMarkup(product) {
    const defaultVariant = product.variants[0];
    const needsCakeSelection = product.category === 'Cakes' && product.variants.length > 1;
    const variantControl = needsCakeSelection
      ? cakeVariantTabs(product)
      : '<div class="variant-single" aria-hidden="true">Pack of 6</div>';
    const allergens = Array.isArray(product.allergens) ? product.allergens.join(', ') : '';
    const initialPrice = needsCakeSelection ? `From ${money(defaultVariant.price)}` : money(defaultVariant.price);
    const initialVariantKey = needsCakeSelection ? '' : defaultVariant.key;
    return `<article class="product-card" data-product-card="${product.id}"><div class="product-image" data-product-preview="${product.id}" role="button" tabindex="0" aria-label="View larger image of ${escapeHtml(product.name)}"><img data-product-image src="${product.image}" alt="${escapeHtml(product.name)} on the Selly Bake House pink background" loading="lazy"><span class="product-badge">${escapeHtml(product.badge)}</span><span class="product-zoom-hint" aria-hidden="true">⌕ View product</span><button class="quick-add" type="button" data-add-product="${product.id}" aria-label="Add ${escapeHtml(product.name)} to cart">+</button></div><div class="product-body"><div class="product-type">${escapeHtml(product.category)}</div><h2 class="product-name" data-product-preview="${product.id}" role="button" tabindex="0" aria-label="View ${escapeHtml(product.name)}">${escapeHtml(product.name)}</h2><p class="product-description">${escapeHtml(product.description)}</p><div class="product-meta"><div class="product-allergens"><strong>Allergens:</strong> ${escapeHtml(allergens)}</div>${variantControl}</div><div class="product-footer"><div><div class="product-price" data-product-price="${product.id}">${initialPrice}</div></div><div class="product-card-action" data-product-action="${product.id}">${productActionMarkup(product, initialVariantKey)}</div></div></div></article>`;
  }
  function refreshProductCardQuantities() {
    document.querySelectorAll('[data-product-card]').forEach(card => {
      const product = getProduct(card.dataset.productCard);
      if (!product) return;
      const variantInput = card.querySelector(`[data-variant-select="${product.id}"]`);
      const needsCakeSelection = product.category === 'Cakes' && product.variants.length > 1;
      const variantKey = needsCakeSelection ? (variantInput?.value || '') : (variantInput?.value || product.variants[0].key);
      const variant = variantKey ? getVariant(product, variantKey) : null;
      const action = card.querySelector(`[data-product-action="${product.id}"]`);
      if (action) action.innerHTML = productActionMarkup(product, variantKey);
      const price = card.querySelector(`[data-product-price="${product.id}"]`);
      if (price) price.textContent = variant ? money(variant.price) : `From ${money(product.variants[0].price)}`;
      card.querySelectorAll(`[data-cake-variant="${product.id}"]`).forEach(button => {
        const active = Boolean(variantKey) && button.dataset.variantKey === variantKey;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    });
  }
  function adjustProductCardQuantity(productId, delta, trigger) {
    const product = getProduct(productId); if (!product) return;
    const card = trigger?.closest('[data-product-card]');
    const variantKey = card?.querySelector(`[data-variant-select="${productId}"]`)?.value || product.variants[0].key;
    const key = `${productId}::${variantKey}`;
    const existing = state.cart.find(item => item.key === key);
    if (delta > 0) {
      if (existing) existing.quantity += delta;
      else state.cart.push({ key, productId, variantKey, quantity: delta });
    } else if (existing) {
      existing.quantity += delta;
      if (existing.quantity <= 0) state.cart = state.cart.filter(item => item.key !== key);
    }
    saveCart();
  }
  function renderHomeProducts() {
    const grid = document.getElementById('homeProductGrid'); if (!grid) return;
    const featuredIds = ['birthday-cookie','vanilla-cupcake','vanilla-cake'];
    grid.innerHTML = featuredIds.map(id => getProduct(id)).filter(Boolean).map(productCardMarkup).join('');
  }
  function renderProducts() {
    const catalog = document.getElementById('productGrid'); if (!catalog) return;
    const query = state.productSearch.trim().toLowerCase();
    const visible = products.filter(product => (state.productFilter === 'All' || product.category === state.productFilter) && (!query || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query)));
    if (!visible.length) { catalog.innerHTML = '<div class="no-results"><strong>No treats matched that search.</strong><br>Try another flavor or choose “All Treats.”</div>'; return; }
    const categoryOrder = ['Cookies','Cupcakes','Cakes'];
    const groups = categoryOrder.map(category => ({ category, items: visible.filter(product => product.category === category) })).filter(group => group.items.length);
    catalog.innerHTML = groups.map(group => `<section class="product-category-section" data-product-category="${group.category}"><div class="product-category-head"><h2>${group.category}</h2><span>${group.items.length} ${group.items.length === 1 ? 'option' : 'options'}</span></div><div class="product-category-grid">${group.items.map(productCardMarkup).join('')}</div></section>`).join('');
  }
  function addToCart(productId, trigger = null) {
    if (!STORE_CONFIG.acceptingOrders) { showToast('Online ordering is temporarily paused.'); return; }
    const product = getProduct(productId); if (!product) return;
    const selector = trigger?.closest('[data-product-card]')?.querySelector(`[data-variant-select="${productId}"]`) || document.querySelector(`[data-variant-select="${productId}"]`);
    const selectedKey = selector?.value || '';
    if (product.category === 'Cakes' && product.variants.length > 1 && !selectedKey) { showToast('Choose a cake size first.'); return; }
    const variantKey = selectedKey || product.variants[0].key;
    const key = `${productId}::${variantKey}`; const existing = state.cart.find(item => item.key === key);
    if (existing) existing.quantity += 1; else state.cart.push({ key, productId, variantKey, quantity: 1 });
    saveCart(); showToast(`${product.name} added to your sweet box.`);
  }
  function updateQuantity(key, delta) { const item = state.cart.find(entry => entry.key === key); if (!item) return; item.quantity += delta; if (item.quantity <= 0) state.cart = state.cart.filter(entry => entry.key !== key); saveCart(); }
  function removeItem(key) { state.cart = state.cart.filter(item => item.key !== key); saveCart(); showToast('Item removed from your sweet box.'); }
  function renderCart() {
    const count = cartCount(); document.querySelectorAll('[data-cart-count]').forEach(element => { element.textContent = count; }); document.querySelectorAll('[data-cart-label]').forEach(element => { element.textContent = `(${count})`; });
    const itemsElement = document.getElementById('cartItems'); const footElement = document.getElementById('cartFoot'); if (!itemsElement || !footElement) return;
    const details = cartDetails();
    if (!details.length) { itemsElement.innerHTML = '<div class="cart-empty"><div><strong>Your sweet box is waiting.</strong><p>Add a cookie box, cupcakes, or a cake to get started.</p><button class="button small" type="button" data-route="shop" data-cart-close>Browse the Menu</button></div></div>'; footElement.innerHTML = ''; return; }
    itemsElement.innerHTML = details.map(item => `<article class="cart-item"><img src="${item.product.image}" alt="${item.product.name}"><div><h3>${item.product.name}</h3><small>${item.variant.label} · ${money(item.variant.price)}</small><div class="quantity"><button type="button" data-quantity="${item.key}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button type="button" data-quantity="${item.key}" data-delta="1" aria-label="Increase quantity">+</button></div></div><button class="remove-item" type="button" data-remove="${item.key}" aria-label="Remove ${item.product.name}">×</button></article>`).join('');
    footElement.innerHTML = `<div class="drawer-total"><span>Subtotal</span><span>${money(subtotal())}</span></div><button class="button full" type="button" data-go-checkout>Review & Checkout <span>→</span></button>`;
  }
  function openCart() { document.querySelector('.drawer-overlay')?.classList.add('open'); document.getElementById('cartDrawer')?.classList.add('open'); document.getElementById('cartDrawer')?.setAttribute('aria-hidden','false'); document.body.classList.add('locked'); }
  function closeCart() { document.querySelector('.drawer-overlay')?.classList.remove('open'); document.getElementById('cartDrawer')?.classList.remove('open'); document.getElementById('cartDrawer')?.setAttribute('aria-hidden','true'); document.body.classList.remove('locked'); }

  function productPreviewPricingMarkup(product) {
    return product.variants.map(variant => `<div class="product-preview-price-row"><span>${escapeHtml(variant.label)}</span><span>${money(variant.price)}</span></div>`).join('');
  }
  function productPreviewVariantMarkup(product) {
    if (product.category !== 'Cakes' || product.variants.length <= 1) return '';
    return `<div class="product-preview-size-block">
      <div class="product-preview-size-heading">Choose a cake size</div>
      <div class="product-preview-size-options" role="group" aria-label="Choose a cake size for ${escapeHtml(product.name)}">
        ${product.variants.map(variant => `<button class="cake-size-tab product-preview-size-tab" type="button" data-preview-cake-variant="${escapeHtml(variant.key)}" aria-pressed="false"><span class="cake-size-label">${escapeHtml(variantSizeText(variant))}</span></button>`).join('')}
      </div>
    </div>`;
  }
  function productPreviewActionMarkup(product) {
    if (!STORE_CONFIG.acceptingOrders) {
      return `<button class="button product-preview-add" type="button" disabled aria-disabled="true">Online Ordering Coming Soon</button>`;
    }
    const needsCakeSelection = product.category === 'Cakes' && product.variants.length > 1;
    const variantKey = needsCakeSelection ? state.previewVariantKey : product.variants[0].key;
    const variant = variantKey ? getVariant(product, variantKey) : null;
    const quantity = variantKey ? cartQuantityFor(product.id, variantKey) : 0;
    if (needsCakeSelection && !variantKey) {
      return `<button class="button product-preview-add" type="button" data-preview-add-product="${escapeHtml(product.id)}" disabled aria-disabled="true">Choose a size to add</button>`;
    }
    const label = quantity ? `Add another · ${money(variant.price)}` : `Add to Cart · ${money(variant.price)}`;
    return `<button class="button product-preview-add" type="button" data-preview-add-product="${escapeHtml(product.id)}">${escapeHtml(label)}</button>${quantity ? `<div class="product-preview-cart-note">${quantity} ${quantity === 1 ? 'item' : 'items'} of this option currently in your cart.</div>` : ''}`;
  }
  function refreshProductPreviewActions() {
    const modal = document.getElementById('productPreviewModal');
    if (!modal?.classList.contains('open')) return;
    const product = getProduct(state.previewProductId);
    if (!product) return;
    modal.querySelectorAll('[data-preview-cake-variant]').forEach(button => {
      const active = Boolean(state.previewVariantKey) && button.dataset.previewCakeVariant === state.previewVariantKey;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    const action = document.getElementById('productPreviewAction');
    if (action) action.innerHTML = productPreviewActionMarkup(product);
  }
  function addPreviewProductToCart(productId) {
    if (!STORE_CONFIG.acceptingOrders) { showToast('Online ordering is temporarily paused.'); return; }
    const product = getProduct(productId); if (!product) return;
    const needsCakeSelection = product.category === 'Cakes' && product.variants.length > 1;
    const variantKey = needsCakeSelection ? state.previewVariantKey : product.variants[0].key;
    if (!variantKey) { showToast('Choose a cake size first.'); return; }
    const key = `${productId}::${variantKey}`;
    const existing = state.cart.find(item => item.key === key);
    if (existing) existing.quantity += 1;
    else state.cart.push({ key, productId, variantKey, quantity: 1 });
    saveCart();
    showToast(`${product.name} added to your sweet box.`);
  }
  function setProductPreviewZoom(zoomed) {
    const media = document.getElementById('productPreviewMedia');
    const button = document.getElementById('productPreviewZoomButton');
    const image = document.getElementById('productPreviewImage');
    const help = document.getElementById('productPreviewZoomHelp');
    if (!media) return;
    const nextZoomed = Boolean(zoomed);
    media.classList.toggle('is-zoomed', nextZoomed);
    if (button) button.setAttribute('aria-pressed', nextZoomed ? 'true' : 'false');
    const label = button?.querySelector('[data-product-zoom-label]');
    if (label) label.textContent = nextZoomed ? 'Reset zoom' : 'Zoom image';
    const icon = button?.querySelector('.product-preview-zoom-icon');
    if (icon) icon.textContent = nextZoomed ? '−' : '＋';
    if (help) help.hidden = !nextZoomed;
    if (image) image.setAttribute('aria-label', nextZoomed ? 'Reset product image zoom' : 'Zoom product image');

    window.requestAnimationFrame(() => {
      if (!nextZoomed) {
        media.scrollTop = 0;
        media.scrollLeft = 0;
        return;
      }
      // Start the enlarged image near its center so the zoom is immediately obvious,
      // while keeping both horizontal and vertical touch scrolling available.
      const maxLeft = Math.max(0, media.scrollWidth - media.clientWidth);
      const maxTop = Math.max(0, media.scrollHeight - media.clientHeight);
      media.scrollLeft = maxLeft / 2;
      media.scrollTop = maxTop / 2;
    });
  }
  function toggleProductPreviewZoom() {
    const media = document.getElementById('productPreviewMedia');
    if (!media) return;
    setProductPreviewZoom(!media.classList.contains('is-zoomed'));
  }

  function openProductPreview(productId) {
    const product = getProduct(productId);
    const modal = document.getElementById('productPreviewModal');
    if (!product || !modal) return;
    state.previewProductId = product.id;
    setProductPreviewZoom(false);
    const card = document.querySelector(`[data-product-card="${product.id}"]`);
    const cardSelection = card?.querySelector(`[data-variant-select="${product.id}"]`)?.value || '';
    state.previewVariantKey = product.category === 'Cakes' && product.variants.length > 1 ? cardSelection : product.variants[0].key;
    const image = document.getElementById('productPreviewImage');
    if (image) { image.src = product.image; image.alt = `${product.name} on the Selly Bake House pink background`; }
    const category = document.getElementById('productPreviewCategory'); if (category) category.textContent = product.category;
    const title = document.getElementById('productPreviewTitle'); if (title) title.textContent = product.name;
    const description = document.getElementById('productPreviewDescription'); if (description) description.textContent = product.description;
    const allergens = document.getElementById('productPreviewAllergens');
    if (allergens) allergens.innerHTML = `<strong>Allergens:</strong> ${escapeHtml((product.allergens || []).join(', '))}`;
    const pricing = document.getElementById('productPreviewPricing'); if (pricing) pricing.innerHTML = productPreviewPricingMarkup(product);
    const variants = document.getElementById('productPreviewVariants'); if (variants) variants.innerHTML = productPreviewVariantMarkup(product);
    const action = document.getElementById('productPreviewAction'); if (action) action.innerHTML = productPreviewActionMarkup(product);
    const previewPanel = modal.querySelector('.product-preview-panel');
    if (previewPanel) previewPanel.scrollTop = 0;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('locked');
    refreshProductPreviewActions();
    window.requestAnimationFrame(() => modal.querySelector('[data-product-preview-close]')?.focus());
  }
  function closeProductPreview() {
    const modal = document.getElementById('productPreviewModal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('locked');
    setProductPreviewZoom(false);
    state.previewProductId = '';
    state.previewVariantKey = '';
  }

  function visibleGalleryIndexes() {
    return galleryItems.map((item,index) => ({ item,index })).filter(entry => state.galleryFilter === 'All' || entry.item.category === state.galleryFilter).map(entry => entry.index);
  }
  function renderGallery() {
    const grid = document.getElementById('galleryGrid'); if (!grid) return;
    const visible = galleryItems.filter(item => state.galleryFilter === 'All' || item.category === state.galleryFilter);
    grid.innerHTML = visible.map((item, visibleIndex) => {
      const itemIndex = galleryItems.indexOf(item);
      const loading = visibleIndex < 10 ? 'eager' : 'lazy';
      return `<button class="gallery-item" type="button" data-gallery-index="${itemIndex}" aria-label="Open ${escapeHtml(item.title)}"><img src="${item.src}" alt="${escapeHtml(item.title)}" loading="${loading}" decoding="async"><span class="gallery-caption"><strong>${escapeHtml(item.title)}</strong><small>Selly Bake House</small></span></button>`;
    }).join('');
  }
  function openLightbox(index) {
    const item = galleryItems[index]; if (!item) return;
    state.lightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    document.getElementById('lightboxImage').src = item.src;
    document.getElementById('lightboxImage').alt = item.title;
    document.getElementById('lightboxTitle').textContent = `${item.title} · Selly Bake House`;
    const visible = visibleGalleryIndexes();
    const position = Math.max(0, visible.indexOf(index));
    document.getElementById('lightboxCounter').textContent = `${position + 1} of ${visible.length}`;
    lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false'); document.body.classList.add('locked');
  }
  function stepLightbox(direction) {
    const visible = visibleGalleryIndexes();
    if (!visible.length) return;
    let position = visible.indexOf(state.lightboxIndex);
    if (position < 0) position = 0;
    openLightbox(visible[(position + direction + visible.length) % visible.length]);
  }
  function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox?.classList.remove('open'); lightbox?.setAttribute('aria-hidden','true');
    state.lightboxIndex = -1; document.body.classList.remove('locked');
  }

  class ConfettiField {
    constructor() {
      this.routes = new Set(['gallery','about']);
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'confetti-canvas';
      this.canvas.setAttribute('aria-hidden','true');
      this.context = this.canvas.getContext('2d', { alpha:true });
      this.image = new Image();
      this.image.src = 'assets/images/decor/star-confetti.png';
      this.imageReady = false;
      this.image.addEventListener('load', () => { this.imageReady = true; this.resetLayers(); this.drawStatic(); });
      this.layers = [];
      this.active = false;
      this.frame = null;
      this.lastTime = 0;
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.resize = this.resize.bind(this);
      this.tick = this.tick.bind(this);
      this.target = null;
      this.observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => this.resize()) : null;
      window.addEventListener('resize', this.resize, { passive:true });
    }
    setRoute(route) {
      const target = document.querySelector(`[data-view="${route}"]`);
      const shouldRun = this.routes.has(route) && target;
      if (!shouldRun) {
        this.active = false;
        if (this.frame) cancelAnimationFrame(this.frame);
        this.frame = null;
        this.observer?.disconnect();
        this.target = null;
        this.canvas.remove();
        return;
      }
      if (this.canvas.parentElement !== target) target.prepend(this.canvas);
      if (this.target !== target) {
        this.observer?.disconnect();
        this.target = target;
        this.observer?.observe(target);
      }
      this.active = true;
      this.resize();
      if (this.reducedMotion) this.drawStatic();
      else if (!this.frame) { this.lastTime = performance.now(); this.frame = requestAnimationFrame(this.tick); }
    }
    resize() {
      if (!this.canvas.isConnected) return;
      const target = this.target || this.canvas.parentElement;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      this.width = Math.max(320, target?.clientWidth || window.innerWidth);
      this.height = Math.max(320, target?.scrollHeight || target?.offsetHeight || window.innerHeight);
      this.ratio = ratio;
      this.canvas.width = Math.round(this.width * ratio);
      this.canvas.height = Math.round(this.height * ratio);
      this.context.setTransform(ratio,0,0,ratio,0,0);
      this.resetLayers();
    }
    resetLayers() {
      if (!this.width || !this.height) return;
      this.layers = [
        { x:-120, y:-80, vx:12, vy:8, tile:620, alpha:.38 },
        { x:-360, y:-240, vx:-9, vy:6, tile:860, alpha:.24 },
        { x:-40, y:-520, vx:7, vy:-11, tile:1080, alpha:.16 }
      ];
    }
    updateLayer(layer, delta) {
      layer.x += layer.vx * delta;
      layer.y += layer.vy * delta;
      const tile = layer.tile;
      while (layer.x > 0) layer.x -= tile;
      while (layer.x <= -tile) layer.x += tile;
      while (layer.y > 0) layer.y -= tile;
      while (layer.y <= -tile) layer.y += tile;
    }
    drawLayer(layer) {
      if (!this.imageReady) return;
      const ctx = this.context;
      ctx.save();
      ctx.globalAlpha = layer.alpha;
      const tile = layer.tile;
      for (let x = layer.x - tile; x < this.width + tile; x += tile) {
        for (let y = layer.y - tile; y < this.height + tile; y += tile) {
          ctx.drawImage(this.image, x, y, tile, tile);
        }
      }
      ctx.restore();
    }
    drawStatic() {
      if (!this.context || !this.width || !this.height) return;
      this.context.clearRect(0,0,this.width,this.height);
      this.layers.forEach(layer => this.drawLayer(layer));
    }
    tick(now) {
      this.frame = null;
      if (!this.active || !this.canvas.isConnected) return;
      const delta = Math.min(.045, Math.max(.001, (now - this.lastTime) / 1000));
      this.lastTime = now;
      this.context.clearRect(0,0,this.width,this.height);
      this.layers.forEach(layer => { this.updateLayer(layer,delta); this.drawLayer(layer); });
      this.frame = requestAnimationFrame(this.tick);
    }
  }

  const memoryFeatured = [0, 6, 10, 15, 18, 20, 24, 28, 30, 33];
  function memoryItemAt(offset) {
    const total = memoryFeatured.length;
    const featuredPosition = (state.memoryCycle + offset + total) % total;
    const itemIndex = memoryFeatured[featuredPosition] % galleryItems.length;
    return { item: galleryItems[itemIndex], itemIndex, featuredPosition };
  }
  function renderMemoryWall(force = false) {
    const stage = document.getElementById('memoryStage');
    if (!stage || (stage.children.length && !force)) return;
    const positions = [-2,-1,0,1,2];
    const cards = positions.map(position => {
      const { item, itemIndex } = memoryItemAt(position);
      return `<button class="memory-card" type="button" data-position="${position}" data-gallery-index="${itemIndex}" aria-label="Open ${escapeHtml(item.title)}"><span class="memory-card-inner"><img src="${item.src}" alt="${escapeHtml(item.title)}"><span class="memory-card-caption"><small>Selly Bake House memory</small><strong>${escapeHtml(item.title)}</strong></span></span></button>`;
    }).join('');
    const dots = memoryFeatured.map((_, index) => `<button class="memory-dot${index === state.memoryCycle ? ' active' : ''}" type="button" data-memory-dot="${index}" aria-label="Show memory ${index + 1}"></button>`).join('');
    stage.innerHTML = `<button class="memory-arrow prev" type="button" data-memory-prev aria-label="Previous gallery memory">←</button><div class="memory-deck">${cards}</div><button class="memory-arrow next" type="button" data-memory-next aria-label="Next gallery memory">→</button><div class="memory-dots" aria-label="Gallery memory slides">${dots}</div><span class="memory-progress">${String(state.memoryCycle + 1).padStart(2,'0')} / ${String(memoryFeatured.length).padStart(2,'0')}</span>`;
  }
  function shuffleMemoryWall(direction = 1, targetIndex = null) {
    if (state.route !== 'gallery') return;
    if (Number.isInteger(targetIndex)) state.memoryCycle = (targetIndex + memoryFeatured.length) % memoryFeatured.length;
    else state.memoryCycle = (state.memoryCycle + direction + memoryFeatured.length) % memoryFeatured.length;
    renderMemoryWall(true);
  }
  function startMemoryWall() {
    renderMemoryWall(true);
    stopMemoryWall();
    state.memoryTimer = window.setInterval(() => shuffleMemoryWall(1), 8500);
  }
  function restartMemoryWall() { stopMemoryWall(); if (state.route === 'gallery') state.memoryTimer = window.setInterval(() => shuffleMemoryWall(1), 8500); }
  function stopMemoryWall() { if (state.memoryTimer) clearInterval(state.memoryTimer); state.memoryTimer = null; }


  const customCakeImages = galleryItems.filter(item => item.category === 'Cakes').map(item => item.src);
  let customCakeTimer = null, customCakeIndex = 0;
  function rotateCustomCakeSet() {
    const imgs = [...document.querySelectorAll('.custom-inspiration img')];
    if (!imgs.length || !customCakeImages.length) return;
    imgs.forEach(img => img.classList.add('inspiration-changing'));
    window.setTimeout(() => {
      imgs.forEach((img, offset) => { img.src = customCakeImages[(customCakeIndex + offset * 5) % customCakeImages.length]; });
      customCakeIndex = (customCakeIndex + imgs.length) % customCakeImages.length;
      imgs.forEach(img => img.classList.remove('inspiration-changing'));
    }, 430);
  }
  function startCustomCakeRotation() {
    stopCustomCakeRotation();
    customCakeTimer = window.setInterval(rotateCustomCakeSet, 7000);
  }
  function stopCustomCakeRotation() { if (customCakeTimer) clearInterval(customCakeTimer); customCakeTimer = null; }

  function updateGalleryMusicButton() {
    document.querySelectorAll('[data-music-toggle]').forEach(button => {
      button.setAttribute('aria-pressed', state.galleryMusicPlaying ? 'true' : 'false');
      button.setAttribute('aria-label', state.galleryMusicPlaying ? 'Pause soft café instrumental music' : 'Play soft café instrumental music');
      const label = button.querySelector('[data-music-label]');
      if (label) label.textContent = state.galleryMusicPlaying ? 'Pause Music' : 'Play Music';
    });
  }
  async function startGalleryMusic() {
    if (!['gallery','about'].includes(state.route) || !state.galleryMusicWanted) return;
    const audio = document.getElementById('galleryMusic'); if (!audio) return;
    audio.volume = window.matchMedia('(max-width: 640px)').matches ? .025 : .055;
    try { await audio.play(); state.galleryMusicPlaying = true; }
    catch { state.galleryMusicPlaying = false; }
    updateGalleryMusicButton();
  }
  function pauseGalleryMusic() {
    const audio = document.getElementById('galleryMusic');
    if (audio && !audio.paused) audio.pause();
    state.galleryMusicPlaying = false;
    updateGalleryMusicButton();
  }
  async function toggleGalleryMusic() {
    const audio = document.getElementById('galleryMusic'); if (!audio) return;
    if (state.galleryMusicPlaying) { state.galleryMusicWanted = false; pauseGalleryMusic(); }
    else { state.galleryMusicWanted = true; await startGalleryMusic(); }
  }

  function openSearch() { document.querySelector('.search-overlay')?.classList.add('open'); document.getElementById('searchPanel')?.classList.add('open'); document.getElementById('searchPanel')?.setAttribute('aria-hidden','false'); document.body.classList.add('locked'); renderSearchResults(''); window.setTimeout(() => document.getElementById('globalSearch')?.focus(),120); }
  function closeSearch() { document.querySelector('.search-overlay')?.classList.remove('open'); document.getElementById('searchPanel')?.classList.remove('open'); document.getElementById('searchPanel')?.setAttribute('aria-hidden','true'); document.body.classList.remove('locked'); }
  function renderSearchResults(query = '') { const results = document.getElementById('searchResults'); if (!results) return; const normalized = query.trim().toLowerCase(); if (!normalized) { results.innerHTML = ''; return; } const visible = products.filter(product => `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(normalized)).slice(0,8); results.innerHTML = visible.length ? visible.map(product => `<button class="search-result" type="button" data-search-product="${product.id}"><img src="${product.image}" alt=""><span><strong>${product.name}</strong><small>${product.category} · from ${money(product.variants[0].price)}</small></span></button>`).join('') : '<div class="no-results" style="grid-column:1/-1;padding:24px">No matching treats found.</div>'; }

  const MARYLAND_TIME_ZONE = 'America/New_York';
  const marylandFormatter = new Intl.DateTimeFormat('en-US', { timeZone:MARYLAND_TIME_ZONE, year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit', hourCycle:'h23' });
  function marylandParts(date) { return Object.fromEntries(marylandFormatter.formatToParts(date).filter(part => part.type !== 'literal').map(part => [part.type,Number(part.value)])); }
  function marylandDateString(date) { const parts = marylandParts(date); return `${parts.year}-${String(parts.month).padStart(2,'0')}-${String(parts.day).padStart(2,'0')}`; }
  function marylandDateTime(dateValue,timeValue) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateValue || '')) || !/^\d{2}:\d{2}$/.test(String(timeValue || ''))) return null;
    const [year,month,day] = dateValue.split('-').map(Number); const [hour,minute] = timeValue.split(':').map(Number); const base = Date.UTC(year,month-1,day,hour,minute,0); let result = new Date(base);
    for (let iteration=0; iteration<2; iteration+=1) { const parts=marylandParts(result); const represented=Date.UTC(parts.year,parts.month-1,parts.day,parts.hour,parts.minute,parts.second); result=new Date(result.getTime()+(base-represented)); }
    return result;
  }
  function dateValueDayOfWeek(dateValue) { const [year,month,day] = String(dateValue).split('-').map(Number); return new Date(Date.UTC(year,month-1,day,12,0,0)).getUTCDay(); }
  function parseClock(value) { const [h,m] = String(value || '00:00').split(':').map(Number); return h * 60 + m; }
  function formatClock(minutes) { const h = Math.floor(minutes / 60); const m = minutes % 60; const suffix = h >= 12 ? 'PM' : 'AM'; const display = h % 12 || 12; return `${display}:${String(m).padStart(2,'0')} ${suffix}`; }
  function minimumFulfillmentDateTime() { return new Date(Date.now() + Number(STORE_CONFIG.leadTimeHours || 24) * 3600000); }
  function selectedFulfillmentDateTime() { const date = document.getElementById('fulfillmentDate')?.value; const time = document.getElementById('fulfillmentTime')?.value; return date && time ? marylandDateTime(date,time) : null; }
  function setMinimumDates() {
    const custom = document.getElementById('customDate'); if (custom) custom.min = marylandDateString(new Date());
    const fulfillment = document.getElementById('fulfillmentDate'); if (fulfillment) { const min = marylandDateString(minimumFulfillmentDateTime()); fulfillment.min = min; if (fulfillment.value && fulfillment.value < min) fulfillment.value = ''; }
    syncAllDateDisplays();
  }
  function populateTimeOptions() {
    const dateInput = document.getElementById('fulfillmentDate'); const select = document.getElementById('fulfillmentTime'); if (!dateInput || !select) return;
    const previous = select.value; const dateValue = dateInput.value;
    if (!dateValue) { select.innerHTML = '<option value="">Select a date first</option>'; return; }
    const dayOfWeek = dateValueDayOfWeek(dateValue); const weekend = dayOfWeek === 0 || dayOfWeek === 6;
    const start = parseClock(weekend ? STORE_CONFIG.weekendStart : STORE_CONFIG.weekdayStart); const end = parseClock(weekend ? STORE_CONFIG.weekendEnd : STORE_CONFIG.weekdayEnd); const cutoff = minimumFulfillmentDateTime();
    const options = [];
    for (let minutes = start; minutes <= end; minutes += 30) {
      const timeValue = `${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`; const slot = marylandDateTime(dateValue,timeValue);
      if (slot && slot >= cutoff) options.push(`<option value="${timeValue}">${formatClock(minutes)}</option>`);
    }
    select.innerHTML = options.length ? `<option value="">Select a time</option>${options.join('')}` : '<option value="">No times available—choose a later date</option>';
    if (options.some(option => option.includes(`value="${previous}"`))) select.value = previous;
  }
  function validateFulfillmentDateTime() {
    const dateValue = document.getElementById('fulfillmentDate')?.value; const timeValue = document.getElementById('fulfillmentTime')?.value; const selected = selectedFulfillmentDateTime();
    if (!dateValue || !timeValue || !selected) { setPaymentStatus('Select a preferred date and time.', 'error'); return false; }
    if (selected < minimumFulfillmentDateTime()) { setPaymentStatus(`Pickup or delivery must be at least ${STORE_CONFIG.leadTimeHours} hours from now.`, 'error'); populateTimeOptions(); return false; }
    const mins = Number(timeValue.split(':')[1]); if (![0,30].includes(mins)) { setPaymentStatus('Choose a time in a 30-minute interval.', 'error'); return false; }
    const dayOfWeek = dateValueDayOfWeek(dateValue); const weekend = dayOfWeek === 0 || dayOfWeek === 6; const min = parseClock(weekend ? STORE_CONFIG.weekendStart : STORE_CONFIG.weekdayStart); const max = parseClock(weekend ? STORE_CONFIG.weekendEnd : STORE_CONFIG.weekdayEnd); const selectedMins = parseClock(timeValue);
    if (selectedMins < min || selectedMins > max) { setPaymentStatus('The selected time is outside the bakery fulfillment hours.', 'error'); return false; }
    return true;
  }

  function deliveryAddressValues() {
    return {
      line1: document.getElementById('deliveryAddress')?.value.trim() || '',
      line2: document.getElementById('deliveryUnit')?.value.trim() || '',
      city: document.getElementById('deliveryCity')?.value.trim() || '',
      state: document.getElementById('deliveryState')?.value.trim().toUpperCase() || '',
      postalCode: document.getElementById('deliveryZip')?.value.trim() || '',
      placeId: document.getElementById('deliveryPlaceId')?.value.trim() || ''
    };
  }
  function deliveryAddressKey(address = deliveryAddressValues()) {
    return [address.line1,address.line2,address.city,address.state,address.postalCode].map(value => String(value || '').trim().toLowerCase()).join('|');
  }
  function clearDeliveryQuote(message = 'Enter your address to calculate the delivery fee.') {
    state.deliveryQuote = null;
    state.deliveryQuoteKey = '';
    const quoteStatus = document.getElementById('deliveryQuoteStatus');
    if (quoteStatus) { quoteStatus.textContent = message; quoteStatus.className = 'delivery-quote-status'; }
    const button = document.querySelector('[data-delivery-quote]');
    if (button) { button.disabled = false; button.textContent = 'Calculate delivery fee'; }
  }
  function clearAddressVerification() {
    state.addressVerified = false;
    const placeId = document.getElementById('deliveryPlaceId'); if (placeId) placeId.value = '';
    clearDeliveryQuote('Address changed—recalculate the delivery fee.');
    setAddressStatus('Complete the Maryland delivery address.', '');
    renderCheckout();
  }
  function setAddressStatus(message, type = '') { const el = document.getElementById('addressStatus'); if (!el) return; el.textContent = message; el.className = `address-status${type ? ` ${type}` : ''}`; }
  function validateDeliveryAddressFields() {
    if (state.fulfillment !== 'delivery') return true;
    const { line1, city, state:stateValue, postalCode:zip } = deliveryAddressValues();
    if (!line1 || !city || !stateValue || !zip) { setAddressStatus('Enter the street address, city, state, and ZIP code.', 'error'); return false; }
    if (stateValue !== 'MD') { setAddressStatus('Delivery orders must use a Maryland address.', 'error'); return false; }
    if (!/^\d{5}(?:-\d{4})?$/.test(zip)) { setAddressStatus('Enter a complete Maryland ZIP code.', 'error'); return false; }
    if (STORE_CONFIG.googleMapsApiKey && !state.addressVerified) { setAddressStatus('Select a complete address from the Google suggestions.', 'error'); return false; }
    setAddressStatus('Maryland delivery address confirmed.', 'valid'); return true;
  }
  function validateDeliveryAddress() {
    if (!validateDeliveryAddressFields()) return false;
    if (state.fulfillment === 'delivery' && (!state.deliveryQuote || state.deliveryQuoteKey !== deliveryAddressKey())) {
      const status = document.getElementById('deliveryQuoteStatus');
      if (status) { status.textContent = 'Calculate the delivery fee before placing the order.'; status.className = 'delivery-quote-status error'; }
      return false;
    }
    return true;
  }
  async function requestDeliveryQuote() {
    if (state.fulfillment !== 'delivery') return true;
    if (!validateDeliveryAddressFields()) return false;
    const address = deliveryAddressValues();
    const key = deliveryAddressKey(address);
    if (state.deliveryQuote && state.deliveryQuoteKey === key) return true;
    const button = document.querySelector('[data-delivery-quote]');
    const status = document.getElementById('deliveryQuoteStatus');
    state.deliveryQuoteLoading = true;
    if (button) { button.disabled = true; button.textContent = 'Calculating…'; }
    if (status) { status.textContent = 'Calculating a local delivery fee from the bakery to this address…'; status.className = 'delivery-quote-status'; }
    try {
      const result = await api('/api/delivery-quote', { method:'POST', body:JSON.stringify({ address }) });
      state.deliveryQuote = result.quote;
      state.deliveryQuoteKey = key;
      const distance = Number(result.quote?.distanceMiles || 0);
      const sourceNote = result.quote?.source === 'google-routes' ? 'road distance' : 'local delivery zone';
      if (status) {
        status.textContent = `${money(result.quote.fee)} delivery fee · ${distance ? `${distance.toFixed(1)} miles · ` : ''}${sourceNote}.`;
        status.className = 'delivery-quote-status valid';
      }
      renderCheckout();
      return true;
    } catch (error) {
      state.deliveryQuote = null;
      state.deliveryQuoteKey = '';
      if (status) { status.textContent = error.message || 'The delivery fee could not be calculated.'; status.className = 'delivery-quote-status error'; }
      return false;
    } finally {
      state.deliveryQuoteLoading = false;
      if (button) { button.disabled = false; button.textContent = 'Recalculate delivery fee'; }
    }
  }
  function parseAddressComponents(components = []) {
    const map = {};
    components.forEach(component => component.types.forEach(type => { map[type] = { long: component.long_name, short: component.short_name }; }));
    return {
      streetNumber: map.street_number?.long || '', route: map.route?.long || '',
      city: map.locality?.long || map.postal_town?.long || map.sublocality?.long || '',
      state: map.administrative_area_level_1?.short || '', zip: map.postal_code?.long || ''
    };
  }
  function handleGooglePlace(place) {
    const parts = parseAddressComponents(place.address_components || []); const complete = parts.streetNumber && parts.route && parts.city && parts.state && parts.zip;
    if (!complete) { state.addressVerified = false; setAddressStatus('That suggestion is incomplete. Choose a full street address.', 'error'); return; }
    if (parts.state !== 'MD') { state.addressVerified = false; setAddressStatus('Delivery is currently limited to Maryland addresses.', 'error'); return; }
    document.getElementById('deliveryAddress').value = `${parts.streetNumber} ${parts.route}`;
    document.getElementById('deliveryCity').value = parts.city; document.getElementById('deliveryState').value = 'MD'; document.getElementById('deliveryZip').value = parts.zip; document.getElementById('deliveryPlaceId').value = place.place_id || '';
    state.addressVerified = true; setAddressStatus('Maryland delivery address confirmed.', 'valid'); clearDeliveryQuote('Address confirmed—calculate the delivery fee.'); requestDeliveryQuote();
  }
  function maybeLoadGooglePlaces() {
    if (!STORE_CONFIG.googleMapsApiKey || window.google?.maps?.places) { if (window.google?.maps?.places) initGoogleAutocomplete(); return; }
    if (document.querySelector('script[data-selly-google-maps]')) return;
    window.__initSellyPlaces = initGoogleAutocomplete;
    const script = document.createElement('script'); script.dataset.sellyGoogleMaps = 'true'; script.async = true; script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(STORE_CONFIG.googleMapsApiKey)}&libraries=places&v=weekly&callback=__initSellyPlaces`;
    script.onerror = () => setAddressStatus('Google address suggestions could not load. Check the Maps API key and domain restrictions.', 'error'); document.head.appendChild(script);
  }
  function initGoogleAutocomplete() {
    const input = document.getElementById('deliveryAddress'); if (!input || !window.google?.maps?.places || state.googleAutocomplete) return;
    state.googleAutocomplete = new google.maps.places.Autocomplete(input, { types: ['address'], componentRestrictions: { country: 'us' }, fields: ['address_components','formatted_address','place_id'] });
    state.googleAutocomplete.addListener('place_changed', () => handleGooglePlace(state.googleAutocomplete.getPlace()));
    setAddressStatus('Start typing and choose a complete Maryland address from the suggestions.');
  }

  function renderCheckout() {
    const itemsContainer = document.getElementById('checkoutItems'); if (!itemsContainer) return;
    const details = cartDetails();
    itemsContainer.innerHTML = details.length ? details.map(item => `
      <div class="summary-item">
        <img src="${item.product.image}" alt="${escapeHtml(item.product.name)}">
        <div class="summary-item-main">
          <strong>${escapeHtml(item.product.name)}</strong>
          <small>${escapeHtml(item.variant.label)} · ${money(item.variant.price)} each</small>
          <div class="summary-item-actions">
            <div class="quantity compact">
              <button type="button" data-quantity="${item.key}" data-delta="-1" aria-label="Decrease ${escapeHtml(item.product.name)} quantity">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-quantity="${item.key}" data-delta="1" aria-label="Increase ${escapeHtml(item.product.name)} quantity">+</button>
            </div>
            <button class="summary-remove" type="button" data-remove="${item.key}">Remove</button>
          </div>
        </div>
        <span class="summary-item-total">${money(item.lineTotal)}</span>
      </div>`).join('') : '<div class="summary-empty">Your cart is empty.<br><button class="button small" type="button" data-route="shop" style="margin-top:12px">Shop Treats</button></div>';
    document.getElementById('checkoutSubtotal').textContent = money(subtotal());
    document.getElementById('checkoutDelivery').textContent = state.fulfillment === 'delivery' && !state.deliveryQuote ? 'Calculate from address' : money(deliveryFee());
    document.getElementById('checkoutTax').textContent = money(taxAmount());
    document.getElementById('checkoutTip').textContent = money(tipAmount());
    document.getElementById('checkoutTotal').textContent = money(total());
    document.querySelectorAll('[data-tip]').forEach(button => button.classList.toggle('active', Number(button.dataset.tip) === state.tipPercent && state.customTip === 0));
    document.querySelectorAll('[data-fulfillment]').forEach(button => button.classList.toggle('active', button.dataset.fulfillment === state.fulfillment));
    const cashChoice = document.getElementById('cashPickupChoice');
    if (cashChoice) {
      cashChoice.hidden = state.fulfillment !== 'pickup';
      if (state.fulfillment !== 'pickup' && state.paymentMethod === 'cash') {
        state.paymentMethod = 'square';
        const online = document.querySelector('input[name=paymentMethod][value=square]');
        if (online) online.checked = true;
      }
    }
    document.querySelectorAll('.payment-choice-card').forEach(card => {
      const input = card.querySelector('input[name="paymentMethod"]');
      card.classList.toggle('active', Boolean(input?.checked));
    });
    const field = document.getElementById('deliveryAddressField');
    const requiredIds = ['deliveryAddress','deliveryCity','deliveryState','deliveryZip'];
    if (field) field.hidden = state.fulfillment !== 'delivery';
    requiredIds.forEach(id => { const input = document.getElementById(id); if (input) input.required = state.fulfillment === 'delivery'; });
    const payButton = document.getElementById('payButton');
    if (payButton) {
      payButton.disabled = !STORE_CONFIG.acceptingOrders;
      payButton.textContent = 'CONTINUE TO CHECKOUT';
    }
    populateTimeOptions();
  }
  function checkoutPayload(form) {
    const formData = new FormData(form);
    return {
      customer: { firstName: formData.get('firstName'), lastName: formData.get('lastName'), email: formData.get('email'), phone: formData.get('phone') },
      fulfillment: { method: state.fulfillment, date: formData.get('date'), time: formData.get('time'), scheduledAtIso: selectedFulfillmentDateTime()?.toISOString() || '', address: { line1: formData.get('addressLine1') || '', line2: formData.get('addressLine2') || '', city: formData.get('city') || '', state: formData.get('state') || '', postalCode: formData.get('postalCode') || '', placeId: formData.get('placeId') || '' }, notes: formData.get('notes') || '', deliveryQuote: state.deliveryQuote ? { ...state.deliveryQuote } : null },
      items: cartDetails().map(item => ({ productId: item.product.id, variantKey: item.variant.key, quantity: item.quantity })), tipPercent: state.tipPercent, customTip: state.customTip, paymentMethod: state.paymentMethod, currency: 'USD'
    };
  }

  function formatConfirmationDate(value) {
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat('en-US', { dateStyle:'medium', timeStyle:'short' }).format(date);
  }
  const PICKUP_ADDRESS = '721 Fallsgrove Dr, Rockville, MD 20850';
  const PICKUP_MAP_URL = 'https://www.google.com/maps/search/?api=1&query=721+Fallsgrove+Dr%2C+Rockville%2C+MD+20850';
  const GOOGLE_REVIEWS_URL = 'https://www.google.com/search?q=selly+bake+house#lrd=0x89b7cdb30f6800b5:0x78334871d7a99b67,1,,,,';

  function paymentDisplay(confirmation) {
    if (confirmation.paymentMethod === 'cash') return 'Cash at Pickup';
    const last4 = String(confirmation.paymentDetails?.last4 || '').replace(/\D/g,'').slice(-4);
    return last4 ? `Credit Card ending in ${last4}` : 'Credit Card';
  }
  function confirmationAddressText(confirmation) {
    if (confirmation.fulfillment?.method !== 'delivery') return PICKUP_ADDRESS;
    return [confirmation.fulfillment.address?.line1, confirmation.fulfillment.address?.line2, confirmation.fulfillment.address?.city, confirmation.fulfillment.address?.state, confirmation.fulfillment.address?.postalCode].filter(Boolean).join(', ');
  }
  function confirmationAddressMarkup(confirmation) {
    const address = confirmationAddressText(confirmation);
    if (confirmation.fulfillment?.method === 'delivery') return escapeHtml(address);
    return `<a class="confirmation-link" href="${PICKUP_MAP_URL}" target="_blank" rel="noopener">${escapeHtml(address)}</a>`;
  }
  function confirmationItemsMarkup(confirmation, compact = false) {
    return (confirmation.items || []).map(item => `<div class="${compact ? 'receipt-item' : 'confirmation-item'}"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}"><div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.variant)} · Qty ${Number(item.quantity || 0)}</small></div><span>${money(item.lineTotal)}</span></div>`).join('');
  }
  function receiptMarkup(confirmation) {
    const isCash = confirmation.paymentStatus === 'PENDING CASH';
    return `<article class="receipt-sheet">
      <header class="receipt-header">
        <img src="assets/images/brand/selly-logo.png" alt="Selly Bake House">
        <div><span>ORDER RECEIPT</span><h2>Selly Bake House</h2><p>Home of Everything Toothsome</p></div>
      </header>
      <div class="receipt-meta">
        <div><span>Order number</span><strong>${escapeHtml(confirmation.orderNumber || 'Pending')}</strong></div>
        <div><span>Placed</span><strong>${escapeHtml(formatConfirmationDate(confirmation.createdAt))}</strong></div>
        <div><span>Payment</span><strong>${escapeHtml(paymentDisplay(confirmation))}</strong></div>
        <div><span>Status</span><strong>${escapeHtml(confirmation.paymentStatus || 'Received')}</strong></div>
      </div>
      <section class="receipt-section"><h3>Items</h3><div class="receipt-items">${confirmationItemsMarkup(confirmation, true) || '<p>No item details are available.</p>'}</div></section>
      <section class="receipt-section receipt-totals">
        <div><span>Subtotal</span><strong>${money(confirmation.amounts?.subtotal)}</strong></div>
        <div><span>Delivery</span><strong>${money(confirmation.amounts?.delivery)}</strong></div>
        <div><span>Maryland tax (6%)</span><strong>${money(confirmation.amounts?.tax)}</strong></div>
        <div><span>Tip</span><strong>${money(confirmation.amounts?.tip)}</strong></div>
        <div class="grand"><span>${isCash ? 'Order total' : 'Total paid'}</span><strong>${money(confirmation.amounts?.total)}</strong></div>
      </section>
      <section class="receipt-section receipt-two-column">
        <div><h3>${confirmation.fulfillment?.method === 'delivery' ? 'Delivery' : 'Pickup'}</h3><p><strong>${escapeHtml(formatConfirmationDate(confirmation.fulfillment?.scheduledAtIso) || `${confirmation.fulfillment?.date || ''} ${confirmation.fulfillment?.time || ''}`)}</strong></p><p>${confirmationAddressMarkup(confirmation)}</p></div>
        <div><h3>Customer</h3><p><strong>${escapeHtml(`${confirmation.customer?.firstName || ''} ${confirmation.customer?.lastName || ''}`.trim())}</strong></p><p>${escapeHtml(confirmation.customer?.phone || '')}${confirmation.customer?.email ? `<br>${escapeHtml(confirmation.customer.email)}` : ''}</p></div>
      </section>
      ${confirmation.fulfillment?.notes ? `<section class="receipt-section"><h3>Order notes</h3><p>${escapeHtml(confirmation.fulfillment.notes)}</p></section>` : ''}
      <footer class="receipt-footer"><p>721 Fallsgrove Dr, Rockville, MD 20850</p><p>sellybakehouse@gmail.com · (301) 356-1232</p></footer>
    </article>`;
  }
  function openReceipt() {
    const confirmation = state.lastConfirmation || loadConfirmation();
    const modal = document.getElementById('receiptModal');
    const content = document.getElementById('receiptContent');
    if (!confirmation || !modal || !content) return;
    content.innerHTML = receiptMarkup(confirmation);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('locked');
  }
  function closeReceipt() {
    const modal = document.getElementById('receiptModal');
    modal?.classList.remove('open');
    modal?.setAttribute('aria-hidden','true');
    document.body.classList.remove('locked');
  }
  function printReceipt() {
    document.body.classList.add('print-receipt');
    window.print();
    window.setTimeout(() => document.body.classList.remove('print-receipt'), 500);
  }

  function renderConfirmation() {
    const container = document.getElementById('confirmationContent');
    if (!container) return;
    const confirmation = state.lastConfirmation || loadConfirmation();
    if (!confirmation) {
      document.getElementById('confirmationIntro').textContent = 'There is no recent order confirmation available in this browser session.';
      container.innerHTML = `<div class="confirmation-card confirmation-empty"><h2>No recent order found</h2><p>Complete checkout to generate an order confirmation.</p><button class="button" type="button" data-route="shop">Shop treats</button></div>`;
      return;
    }
    document.getElementById('confirmationIntro').textContent = confirmation.paymentStatus === 'COMPLETED'
      ? 'Your payment was completed securely, and Selly Bake House has received your order.'
      : confirmation.paymentStatus === 'PENDING CASH'
        ? 'Your pickup order has been received. Payment is due in cash at pickup after bakery confirmation.'
        : 'Selly Bake House has received your order. Please review the payment status below.';
    const isCash = confirmation.paymentStatus === 'PENDING CASH';
    const addressLabel = confirmation.fulfillment?.method === 'delivery' ? 'Delivery Address' : 'Pickup Address';
    container.innerHTML = `
      <div class="confirmation-grid">
        <div>
          <div class="confirmation-card">
            <div class="confirmation-number"><div><span>ORDER NUMBER:</span> <strong>${escapeHtml(confirmation.orderNumber || 'Pending')}</strong></div><div class="confirmation-status">${escapeHtml(confirmation.paymentStatus || 'Received')}</div></div>
          </div>
          <div class="confirmation-card">
            <h2>Order details</h2>
            <div class="confirmation-items">${confirmationItemsMarkup(confirmation) || '<p>No item details are available.</p>'}</div>
            <div class="confirmation-totals">
              <div class="confirmation-total-line"><span>Subtotal</span><strong>${money(confirmation.amounts?.subtotal)}</strong></div>
              <div class="confirmation-total-line"><span>Delivery</span><strong>${money(confirmation.amounts?.delivery)}</strong></div>
              <div class="confirmation-total-line"><span>Maryland tax (6%)</span><strong>${money(confirmation.amounts?.tax)}</strong></div>
              <div class="confirmation-total-line"><span>Tip</span><strong>${money(confirmation.amounts?.tip)}</strong></div>
              <div class="confirmation-total-line grand"><span>${isCash ? 'Order total' : 'Total paid'}</span><strong>${money(confirmation.amounts?.total)}</strong></div>
            </div>
          </div>
        </div>
        <aside>
          <div class="confirmation-card">
            <h2>Pickup or delivery</h2>
            <div class="confirmation-details">
              <div class="confirmation-detail"><span>Method</span><strong>${confirmation.fulfillment?.method === 'delivery' ? 'Maryland delivery' : 'Pickup'}</strong></div>
              <div class="confirmation-detail"><span>Date & time</span><strong>${escapeHtml(formatConfirmationDate(confirmation.fulfillment?.scheduledAtIso) || `${confirmation.fulfillment?.date || ''} ${confirmation.fulfillment?.time || ''}`)}</strong></div>
              <div class="confirmation-detail"><span>${addressLabel}</span><div>${confirmationAddressMarkup(confirmation)}</div></div>
              ${confirmation.fulfillment?.method === 'delivery' && confirmation.fulfillment?.deliveryQuote?.distanceMiles ? `<div class="confirmation-detail"><span>Delivery distance</span><strong>${Number(confirmation.fulfillment.deliveryQuote.distanceMiles).toFixed(1)} miles</strong></div>` : ''}
              <div class="confirmation-detail"><span>Payment</span><strong>${escapeHtml(paymentDisplay(confirmation))}</strong></div>
              ${confirmation.fulfillment?.notes ? `<div class="confirmation-detail"><span>Notes</span><div>${escapeHtml(confirmation.fulfillment.notes)}</div></div>` : ''}
            </div>
          </div>
          <div class="confirmation-card">
            <h2>Contact information</h2>
            <div class="confirmation-details">
              <div class="confirmation-detail"><span>Name</span><strong>${escapeHtml(`${confirmation.customer?.firstName || ''} ${confirmation.customer?.lastName || ''}`.trim())}</strong></div>
              <div class="confirmation-detail"><span>Phone</span><div>${escapeHtml(confirmation.customer?.phone || '')}</div></div>
              ${confirmation.customer?.email ? `<div class="confirmation-detail"><span>Email</span><div>${escapeHtml(confirmation.customer.email)}</div></div>` : ''}
              <div class="confirmation-detail"><span>Placed</span><div>${escapeHtml(formatConfirmationDate(confirmation.createdAt))}</div></div>
            </div>
            <div class="confirmation-actions">
              <button class="button secondary full" type="button" data-view-receipt>View Receipt</button>
              <a class="button secondary full review-button" href="${GOOGLE_REVIEWS_URL}" target="_blank" rel="noopener">Read Our Google Reviews</a>
              <button class="button secondary full" type="button" data-print-confirmation>Print confirmation</button>
              <button class="button full" type="button" data-route="shop">Continue shopping</button>
            </div>
            <p class="confirmation-footnote">Keep this order number for your records. Customer accounts are optional and are not required to complete an order.</p>
          </div>
        </aside>
      </div>`;
  }

  function squareConfigured() { const { applicationId, locationId, paymentEndpoint } = STORE_CONFIG.square; return Boolean(applicationId && locationId && paymentEndpoint); }
  async function loadSquareSdk() { if (window.Square) return; const src = STORE_CONFIG.square.environment === 'production' ? 'https://web.squarecdn.com/v1/square.js' : 'https://sandbox.web.squarecdn.com/v1/square.js'; await new Promise((resolve,reject) => { const script = document.createElement('script'); script.src = src; script.async = true; script.onload = resolve; script.onerror = () => reject(new Error('The Square payment library could not be loaded.')); document.head.appendChild(script); }); }
  async function initSquarePayment() {
    if (state.squareReady || state.processing || !squareConfigured()) return;
    try { await loadSquareSdk(); state.squarePayments = window.Square.payments(STORE_CONFIG.square.applicationId, STORE_CONFIG.square.locationId); state.card = await state.squarePayments.card(); await state.card.attach('#card-container'); state.squareReady = true; document.getElementById('squarePlaceholder').hidden = true; setPaymentStatus('Square secure card entry is ready.'); }
    catch (error) { setPaymentStatus(error.message || 'Square could not be initialized.', 'error'); }
  }
  async function handleCheckoutSubmit(event) {
    event.preventDefault(); const form = event.currentTarget;
    if (!STORE_CONFIG.acceptingOrders) { setPaymentStatus('Online ordering is temporarily paused.', 'error'); return; }
    if (!state.cart.length) { setPaymentStatus('Add at least one item before continuing to payment.', 'error'); navigate('shop'); return; }
    if (!form.reportValidity() || !validateFulfillmentDateTime()) return;
    if (state.fulfillment === 'delivery' && (!state.deliveryQuote || state.deliveryQuoteKey !== deliveryAddressKey())) {
      const quoted = await requestDeliveryQuote();
      if (!quoted) return;
    }
    if (!validateDeliveryAddress()) return;
    const formData = new FormData(form); state.paymentMethod = String(formData.get('paymentMethod') || 'square');
    if (state.paymentMethod === 'cash' && state.fulfillment !== 'pickup') { setPaymentStatus('Cash is available only for pickup orders.', 'error'); return; }
    if (state.fulfillment === 'delivery' && state.paymentMethod !== 'square') { setPaymentStatus('Maryland delivery orders require confirmed online payment details.', 'error'); return; }
    if (state.paymentMethod === 'square' && !squareConfigured()) { setPaymentStatus('Square is not connected yet. Add the Square browser credentials and server access token before accepting live payments.', 'error'); document.getElementById('squarePanel')?.scrollIntoView({ behavior:'smooth', block:'center' }); return; }
    if (state.paymentMethod === 'square' && (!state.squareReady || !state.card)) { await initSquarePayment(); if (!state.squareReady) return; }
    const button = document.getElementById('payButton'); state.processing = true; button.disabled = true; button.textContent = state.paymentMethod === 'cash' ? 'Placing order…' : 'Processing securely…'; setPaymentStatus(state.paymentMethod === 'cash' ? 'Submitting your cash-at-pickup order…' : 'Tokenizing payment securely with Square…');
    try {
      const verificationDetails = { amount: total().toFixed(2), billingContact: { givenName: String(formData.get('firstName') || ''), familyName: String(formData.get('lastName') || ''), email: String(formData.get('email') || ''), phone: String(formData.get('phone') || ''), countryCode: 'US' }, currencyCode: 'USD', intent: 'CHARGE', customerInitiated: true, sellerKeyedIn: false };
      let sourceId = '';
      if (state.paymentMethod === 'square') { const tokenResult = await state.card.tokenize(verificationDetails); if (tokenResult.status !== 'OK') throw new Error(tokenResult.errors?.map(error => error.message).join(' ') || 'Card details could not be tokenized.'); sourceId = tokenResult.token; }
      const orderPayload = checkoutPayload(form);
      const itemSnapshot = cartDetails().map(item => ({ name:item.product.name, image:item.product.image, variant:item.variant.label, quantity:item.quantity, lineTotal:item.lineTotal }));
      const amountSnapshot = { subtotal:subtotal(), delivery:deliveryFee(), tax:taxAmount(), tip:tipAmount(), total:total() };
      const endpoint = state.paymentMethod === 'cash' ? '/api/orders/cash' : STORE_CONFIG.square.paymentEndpoint;
      const body = state.paymentMethod === 'cash' ? { order: orderPayload } : { sourceId, idempotencyKey: crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`, order: orderPayload };
      const result = await api(endpoint, { method:'POST', body: JSON.stringify(body) });
      saveConfirmation({
        orderNumber:result.orderNumber || '',
        paymentStatus:result.paymentStatus || (state.paymentMethod === 'cash' ? 'PENDING CASH' : 'COMPLETED'),
        paymentMethod:state.paymentMethod,
        paymentDetails:result.paymentDetails || null,
        receiptUrl:result.receiptUrl || '',
        createdAt:new Date().toISOString(),
        customer:orderPayload.customer,
        fulfillment:{ ...orderPayload.fulfillment, deliveryQuote:result.deliveryQuote || (state.deliveryQuote ? { ...state.deliveryQuote } : null) },
        items:itemSnapshot,
        amounts:result.amounts || amountSnapshot
      });
      setPaymentStatus(`Payment successful. Order ${result.orderNumber || ''} received.`, 'success'); state.cart = []; saveCart(); showToast('Payment successful. Your order has been received.'); await loadOrders(); navigate('confirmation');
    } catch (error) { setPaymentStatus(error.message || 'Payment could not be completed. Please review the information and try again.', 'error'); }
    finally { state.processing = false; button.disabled = false; button.textContent = 'CONTINUE TO CHECKOUT'; }
  }
  function setPaymentStatus(message, type = '') { const element = document.getElementById('paymentStatus'); if (!element) return; element.textContent = message; element.className = `payment-status${type ? ` ${type}` : ''}`; }

  async function loadSession() {
    if (!state.apiAvailable) { state.user = null; renderAccount(); return; }
    try { const data = await api('/api/auth/me', { method:'GET', headers:{} }); state.user = data.user || null; }
    catch { state.user = null; }
    renderAccount(); renderAdmin();
  }
  function renderAccount() {
    const guest = document.getElementById('accountGuest'); const member = document.getElementById('accountMember'); if (!guest || !member) return;
    guest.hidden = Boolean(state.user); member.hidden = !state.user; document.getElementById('accountStatusDot')?.classList.toggle('signed-in', Boolean(state.user));
    if (!state.user) return;
    document.getElementById('memberName').textContent = state.user.name || 'Your account'; document.getElementById('memberEmail').textContent = state.user.email || '';
    document.getElementById('adminAccessButton').hidden = state.user.role !== 'admin';
    const [firstName, ...rest] = String(state.user.name || '').split(' '); const lastName = rest.join(' ');
    const fields = { checkoutFirst:firstName, checkoutLast:lastName, checkoutEmail:state.user.email || '' };
    Object.entries(fields).forEach(([id,value]) => { const input = document.getElementById(id); if (input && !input.value) input.value = value; });
    renderOrders();
  }
  async function handleLogin(event) { event.preventDefault(); const status = document.getElementById('loginStatus'); status.textContent = 'Signing in…'; status.className = 'form-status'; try { const data = await api('/api/auth/login', { method:'POST', body:JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) }); state.user = data.user; status.textContent = 'Signed in successfully.'; status.className = 'form-status success'; renderAccount(); await loadOrders(); } catch (error) { status.textContent = error.message; status.className = 'form-status error'; } }
  async function handleRegister(event) { event.preventDefault(); const status = document.getElementById('registerStatus'); status.textContent = 'Creating account…'; status.className = 'form-status'; try { const data = await api('/api/auth/register', { method:'POST', body:JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) }); state.user = data.user; status.textContent = 'Account created and signed in.'; status.className = 'form-status success'; renderAccount(); } catch (error) { status.textContent = error.message; status.className = 'form-status error'; } }
  async function logout() { try { await api('/api/auth/logout', { method:'POST', body:'{}' }); } catch {} state.user = null; state.orders = []; renderAccount(); renderAdmin(); showToast('You have signed out.'); }
  async function loadOrders() {
    if (!state.user || !state.apiAvailable) { state.orders = []; renderOrders(); return; }
    try { const data = await api('/api/orders', { method:'GET', headers:{} }); state.orders = data.orders || []; }
    catch { state.orders = []; }
    renderOrders();
  }
  function renderOrders() {
    const container = document.getElementById('accountOrders'); if (!container) return;
    if (!state.orders.length) { container.innerHTML = '<p class="muted-copy">No completed orders yet.</p>'; return; }
    container.innerHTML = state.orders.map(order => `<div class="order-row"><div><strong>${escapeHtml(order.orderNumber)}</strong><small>${escapeHtml(order.createdAtDisplay || order.createdAt)} · ${escapeHtml(order.fulfillment?.method || '')}</small></div><strong>${money(order.total)}</strong></div>`).join('');
  }

  function renderAdmin() {
    const denied = document.getElementById('adminDenied'); const form = document.getElementById('adminSettingsForm'); const passwordForm = document.getElementById('adminPasswordForm'); if (!denied || !form) return;
    const allowed = state.user?.role === 'admin'; denied.hidden = allowed; form.hidden = !allowed; if (passwordForm) passwordForm.hidden = !allowed; if (!allowed) return;
    const values = { adminAnnouncement:STORE_CONFIG.announcement, adminEmail:STORE_CONFIG.email, adminPhone:STORE_CONFIG.phone, adminLeadTime:STORE_CONFIG.leadTimeHours, adminDeliveryFee:STORE_CONFIG.deliveryFee, adminWeekdayStart:STORE_CONFIG.weekdayStart, adminWeekdayEnd:STORE_CONFIG.weekdayEnd, adminWeekendStart:STORE_CONFIG.weekendStart, adminWeekendEnd:STORE_CONFIG.weekendEnd, adminSlideInterval:STORE_CONFIG.heroIntervalSeconds, adminMapsKey:STORE_CONFIG.googleMapsApiKey };
    Object.entries(values).forEach(([id,value]) => { const input = document.getElementById(id); if (input) input.value = value ?? ''; }); document.getElementById('adminAcceptingOrders').checked = Boolean(STORE_CONFIG.acceptingOrders);
  }
  async function handleAdminSave(event) {
    event.preventDefault(); const status = document.getElementById('adminStatus'); const data = Object.fromEntries(new FormData(event.currentTarget)); data.acceptingOrders = document.getElementById('adminAcceptingOrders').checked; data.leadTimeHours = Number(data.leadTimeHours); data.deliveryFee = Number(data.deliveryFee); data.heroIntervalSeconds = Number(data.heroIntervalSeconds);
    status.textContent = 'Saving settings…'; status.className = 'form-status';
    try { const result = await api('/api/admin/settings', { method:'PUT', body:JSON.stringify(data) }); Object.assign(STORE_CONFIG, result.settings); applyPublicSettings(); renderAdmin(); renderCheckout(); status.textContent = 'Settings saved.'; status.className = 'form-status success'; }
    catch (error) { status.textContent = error.message; status.className = 'form-status error'; }
  }

  async function handleAdminPasswordChange(event) {
    event.preventDefault();
    const status = document.getElementById('adminPasswordStatus');
    status.textContent = 'Updating password…'; status.className = 'form-status';
    try {
      await api('/api/auth/change-password', { method:'POST', body:JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) });
      event.currentTarget.reset(); status.textContent = 'Administrator password updated.'; status.className = 'form-status success';
    } catch (error) { status.textContent = error.message; status.className = 'form-status error'; }
  }

  function dateInputValue(date) {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0,10);
  }
  function formatIsoDateForDisplay(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
    return match ? `${match[2]}/${match[3]}/${match[1]}` : '';
  }
  function syncDateDisplay(inputId, displayId) {
    const input = document.getElementById(inputId);
    const display = document.getElementById(displayId);
    if (display) display.value = input?.value ? formatIsoDateForDisplay(input.value) : '';
  }
  function syncAllDateDisplays() {
    syncDateDisplay('customDate','customDateDisplay');
    syncDateDisplay('fulfillmentDate','fulfillmentDateDisplay');
  }
  function setCustomDateMinimum() {
    const input = document.getElementById('customDate'); if (!input) return;
    const minimum = new Date(); minimum.setHours(0,0,0,0); minimum.setDate(minimum.getDate() + 7);
    input.min = dateInputValue(minimum);
    if (input.value && input.value < input.min) input.value = '';
    syncDateDisplay('customDate','customDateDisplay');
  }
  function renderCustomFilePreviews() {
    const preview = document.getElementById('customFilePreview');
    const toolbar = document.getElementById('customFileToolbar');
    const count = document.getElementById('customFileCount');
    if (!preview || !toolbar || !count) return;
    if (!state.customFiles.length) {
      preview.innerHTML = ''; preview.hidden = true; toolbar.hidden = true; count.textContent = '0 images selected'; return;
    }
    preview.hidden = false; toolbar.hidden = false;
    count.textContent = `${state.customFiles.length} ${state.customFiles.length === 1 ? 'image' : 'images'} selected`;
    preview.innerHTML = state.customFiles.map((entry,index) => `<article class="custom-preview-card"><img src="${entry.url}" alt="Selected reference image ${index + 1}"><div class="custom-preview-meta"><span class="custom-preview-name" title="${escapeHtml(entry.file.name)}">${escapeHtml(entry.file.name)}</span><button class="custom-preview-clear" type="button" data-custom-file-remove="${index}">Clear</button></div></article>`).join('');
  }
  function clearCustomFiles() {
    state.customFiles.forEach(entry => URL.revokeObjectURL(entry.url));
    state.customFiles = [];
    const input = document.getElementById('customFile'); if (input) input.value = '';
    renderCustomFilePreviews();
  }
  function addCustomFiles(fileList) {
    const allowed = new Set(['image/jpeg','image/png','image/webp']);
    const incoming = [...(fileList || [])];
    for (const file of incoming) {
      if (!allowed.has(file.type)) { showToast(`${file.name} is not a supported image type.`); continue; }
      if (file.size > 5 * 1024 * 1024) { showToast(`${file.name} is larger than 5 MB.`); continue; }
      if (state.customFiles.some(entry => entry.file.name === file.name && entry.file.size === file.size && entry.file.lastModified === file.lastModified)) continue;
      if (state.customFiles.length >= 5) { showToast('You can attach up to 5 reference images.'); break; }
      state.customFiles.push({ file, url: URL.createObjectURL(file) });
    }
    renderCustomFilePreviews();
  }
  function readFileAsDataUrl(file) {
    return new Promise((resolve,reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error(`${file.name} could not be read.`));
      reader.readAsDataURL(file);
    });
  }
  function renderCustomConfirmation() {
    const container = document.getElementById('customConfirmationContent'); if (!container) return;
    const confirmation = state.lastCustomConfirmation || loadCustomConfirmation();
    if (!confirmation) {
      container.innerHTML = `<div class="confirmation-card confirmation-empty custom-confirmation-card"><h2>No recent custom request found</h2><p>Submit the custom cake form to generate a request confirmation.</p><button class="button" type="button" data-route="custom">Start a custom request</button></div>`;
      return;
    }
    container.innerHTML = `<div class="confirmation-card custom-confirmation-card">
      <div class="confirmation-number"><div><span>REQUEST NUMBER:</span> <strong>${escapeHtml(confirmation.requestNumber || 'Pending')}</strong></div><div class="confirmation-status">RECEIVED</div></div>
      <h2 style="margin-top:24px">What happens next</h2>
      <p>Selly Bake House will review your event date, servings, design notes, and reference images and contact you within 24 hours. Requests are accepted for Maryland pickup or delivery only.</p>
      <div class="custom-next-steps">
        <div class="custom-next-step"><strong>1. Design review</strong><span>We will confirm availability, design details, serving needs, and timing.</span></div>
        <div class="custom-next-step"><strong>2. Quote & deposit</strong><span>A 50% upfront payment is required after the design and price are approved.</span></div>
        <div class="custom-next-step"><strong>3. Production planning</strong><span>Large or highly detailed orders may need additional lead time, which will be discussed in our response.</span></div>
      </div>
      <div class="confirmation-details" style="margin-top:22px">
        <div class="confirmation-detail"><span>Event date</span><strong>${escapeHtml(formatIsoDateForDisplay(confirmation.date) || confirmation.date || '')}</strong></div>
        <div class="confirmation-detail"><span>Reference images</span><strong>${Number(confirmation.imageCount || 0)}</strong></div>
        <div class="confirmation-detail"><span>Your phone</span><div><a class="confirmation-link" href="tel:${escapeHtml(String(confirmation.phone || '').replace(/[^0-9+]/g,''))}">${escapeHtml(confirmation.phone || '')}</a></div></div>
        ${confirmation.email ? `<div class="confirmation-detail"><span>Your email</span><div><a class="confirmation-link" href="mailto:${escapeHtml(confirmation.email)}">${escapeHtml(confirmation.email)}</a></div></div>` : ''}
      </div>
      <p class="confirmation-footnote">Please keep your request number for your records. Submitting a request does not reserve the date until availability, pricing, and the required deposit are confirmed. Questions? <a class="confirmation-link" href="mailto:${escapeHtml(STORE_CONFIG.email)}">Email Selly Bake House</a>.</p>
      <div class="confirmation-actions"><button class="button secondary full" type="button" data-route="gallery">Browse cake inspiration</button><button class="button full" type="button" data-route="home">Return home</button></div>
    </div>`;
  }
  async function handleCustomCakeSubmit(event) {
    event.preventDefault();
    
      if (!STORE_CONFIG.acceptingOrders) {
    const status = document.getElementById('customRequestStatus');

    if (status) {
      status.textContent =
        'Custom cake inquiries are not currently being accepted online. Online ordering is coming soon.';
      status.className = 'form-status';
    }

    return;
  }
    const form = event.currentTarget;
    const status = document.getElementById('customRequestStatus');
    setCustomDateMinimum();
    if (!form.reportValidity()) return;
    const selectedDate = document.getElementById('customDate')?.value || '';
    const minimumDate = document.getElementById('customDate')?.min || '';
    if (!selectedDate || selectedDate < minimumDate) {
      status.textContent = 'Choose an event date at least 1 week from today.'; status.className = 'form-status error'; return;
    }
    status.textContent = 'Submitting your custom cake request…'; status.className = 'form-status';
    try {
      const fd = new FormData(form);
      const payload = Object.fromEntries(fd);
      delete payload.file;
      payload.images = await Promise.all(state.customFiles.map(async entry => ({ name:entry.file.name, type:entry.file.type, data:await readFileAsDataUrl(entry.file) })));
      const result = await api('/api/custom-inquiries',{ method:'POST', body:JSON.stringify(payload) });
      saveCustomConfirmation({ requestNumber:result.requestNumber, date:payload.date, email:payload.email, phone:payload.phone, imageCount:result.imageCount ?? payload.images.length, createdAt:new Date().toISOString() });
      form.reset(); syncDateDisplay('customDate','customDateDisplay'); clearCustomFiles(); status.textContent = ''; status.className = 'form-status';
      navigate('custom-confirmation');
    } catch (error) {
      status.textContent = error.message; status.className = 'form-status error';
    }
  }

  let toastTimer;
  function showToast(message) { const toast = document.getElementById('toast'); if (!toast) return; toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'),3200); }

  function openBakeryDetails() {
    const popover = document.getElementById('bakeryDetailsPopover');
    const trigger = document.querySelector('[data-location-info]');
    if (!popover) return;
    popover.hidden = false;
    trigger?.setAttribute('aria-expanded','true');
    window.requestAnimationFrame(() => popover.querySelector('[data-location-info-close]')?.focus());
  }
  function closeBakeryDetails() {
    const popover = document.getElementById('bakeryDetailsPopover');
    const trigger = document.querySelector('[data-location-info]');
    if (!popover) return;
    popover.hidden = true;
    trigger?.setAttribute('aria-expanded','false');
    trigger?.focus();
  }

  const MOBILE_SWIPE_ROUTES = ['home','shop','custom','gallery','about'];
  function isPhoneSwipeViewport() {
    // Touch events already gate the gesture itself; width-only detection avoids mobile
    // Safari/media-query quirks that can otherwise prevent valid phone swipes.
    return Math.min(window.innerWidth || 9999, document.documentElement?.clientWidth || 9999) <= 640;
  }
  function mobileSwipeOverlayOpen() {
    return Boolean(
      document.querySelector('.product-preview-modal.open, .lightbox.open, .cart-drawer.open, .search-panel.open, .receipt-modal.open') ||
      document.body.classList.contains('locked')
    );
  }
  function mobileSwipeEligibleTarget(target) {
    if (!(target instanceof Element)) return true;
    // Allow swipes to begin on product cards, images, links and normal buttons so the
    // gesture works across the actual phone page. Block only controls where a swipe
    // would interfere with typing, selecting, scrolling inside overlays, or menus.
    return !target.closest('input, textarea, select, [contenteditable="true"], .product-preview-modal, .lightbox, .cart-drawer, .search-panel, .receipt-modal, .bakery-details-popover, .header-nav');
  }
  function navigateByMobileSwipe(direction) {
    if (!isPhoneSwipeViewport() || mobileSwipeOverlayOpen()) return false;
    const index = MOBILE_SWIPE_ROUTES.indexOf(state.route);
    if (index < 0) return false;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= MOBILE_SWIPE_ROUTES.length) return false;
    navigate(MOBILE_SWIPE_ROUTES[nextIndex]);
    return true;
  }

  function bindEvents() {
    document.addEventListener('click', event => {
      const routeControl = event.target.closest('[data-route]');

if (routeControl) {
  event.preventDefault();

  const scrollToProducts = routeControl.hasAttribute('data-scroll-products');
  const nextRoute = routeControl.dataset.route;

  closeCart();
  closeSearch();
  navigate(nextRoute);

  if (scrollToProducts) {
    window.setTimeout(() => {
      const target = document.getElementById('productGrid');
      const header = document.getElementById('siteHeader');

      if (target) {
        const headerOffset = (header?.offsetHeight || 0) + 18;
        const targetPosition =
          target.getBoundingClientRect().top +
          window.scrollY -
          headerOffset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  }

  if (
    ['gallery', 'about'].includes(nextRoute) &&
    state.galleryMusicWanted
  ) {
    startGalleryMusic();
  }

  return;
}
      if (event.target.closest('[data-menu-toggle]')) { document.getElementById('headerNav')?.classList.toggle('open'); return; }
      if (event.target.closest('[data-location-info-close]')) { closeBakeryDetails(); return; }
      if (event.target.closest('[data-location-info]')) { openBakeryDetails(); return; }
      if (event.target.closest('[data-cart-open]')) { openCart(); return; } if (event.target.closest('[data-cart-close]')) { closeCart(); return; }
      if (event.target.closest('[data-search-open]')) { openSearch(); return; } if (event.target.closest('[data-search-close]')) { closeSearch(); return; }
      if (event.target.closest('[data-product-preview-close]') || event.target.id === 'productPreviewModal') { closeProductPreview(); return; }
      const productPreview = event.target.closest('[data-product-preview]');
      if (productPreview && !event.target.closest('button, a, input, select, textarea, label')) { openProductPreview(productPreview.dataset.productPreview); return; }
      if (event.target.closest('[data-lightbox-close]') || event.target.id === 'lightbox') { closeLightbox(); return; }
      if (event.target.closest('[data-lightbox-prev]')) { stepLightbox(-1); return; }
      if (event.target.closest('[data-lightbox-next]')) { stepLightbox(1); return; }
      if (event.target.closest('[data-receipt-close]') || event.target.id === 'receiptModal') { closeReceipt(); return; }
      if (event.target.closest('[data-view-receipt]')) { openReceipt(); return; }
      if (event.target.closest('[data-print-receipt]')) { printReceipt(); return; }
      if (event.target.closest('[data-custom-files-clear-all]')) { clearCustomFiles(); return; }
      const clearCustomFile = event.target.closest('[data-custom-file-remove]');
      if (clearCustomFile) {
        const index = Number(clearCustomFile.dataset.customFileRemove);
        const [removed] = state.customFiles.splice(index,1);
        if (removed) URL.revokeObjectURL(removed.url);
        renderCustomFilePreviews(); return;
      }
      if (event.target.closest('[data-music-toggle]')) { toggleGalleryMusic(); return; }
      const cakeVariant = event.target.closest('[data-cake-variant]');
      if (cakeVariant) {
        const card = cakeVariant.closest('[data-product-card]');
        const productId = cakeVariant.dataset.cakeVariant;
        const input = card?.querySelector(`[data-variant-select="${productId}"]`);
        if (input) input.value = input.value === cakeVariant.dataset.variantKey ? '' : cakeVariant.dataset.variantKey;
        refreshProductCardQuantities();
        return;
      }
      const previewCakeVariant = event.target.closest('[data-preview-cake-variant]');
      if (previewCakeVariant) {
        const nextKey = previewCakeVariant.dataset.previewCakeVariant;
        state.previewVariantKey = state.previewVariantKey === nextKey ? '' : nextKey;
        refreshProductPreviewActions();
        return;
      }
      const previewAddButton = event.target.closest('[data-preview-add-product]');
      if (previewAddButton) { addPreviewProductToCart(previewAddButton.dataset.previewAddProduct); return; }
      const addButton = event.target.closest('[data-add-product]'); if (addButton) { addToCart(addButton.dataset.addProduct, addButton); return; }
      const productStep = event.target.closest('[data-product-step]'); if (productStep) { adjustProductCardQuantity(productStep.dataset.productStep, Number(productStep.dataset.delta), productStep); return; }
      const quantityButton = event.target.closest('[data-quantity]'); if (quantityButton) { updateQuantity(quantityButton.dataset.quantity,Number(quantityButton.dataset.delta)); return; }
      const removeButton = event.target.closest('[data-remove]'); if (removeButton) { removeItem(removeButton.dataset.remove); return; }
      if (event.target.closest('[data-go-checkout]')) { closeCart(); navigate('checkout'); return; }
      const productFilter = event.target.closest('[data-product-filter]'); if (productFilter) { state.productFilter = productFilter.dataset.productFilter; document.querySelectorAll('[data-product-filter]').forEach(button => button.classList.toggle('active',button===productFilter)); renderProducts(); return; }
      const homeCategory = event.target.closest('[data-home-category]'); if (homeCategory) { state.productFilter = homeCategory.dataset.homeCategory; state.productSearch = ''; const shopSearch = document.getElementById('shopSearch'); if (shopSearch) shopSearch.value = ''; document.querySelectorAll('[data-product-filter]').forEach(button => button.classList.toggle('active', button.dataset.productFilter === state.productFilter)); renderProducts(); navigate('shop'); return; }
      if (event.target.closest('[data-memory-prev]')) { shuffleMemoryWall(-1); restartMemoryWall(); return; }
      if (event.target.closest('[data-memory-next]')) { shuffleMemoryWall(1); restartMemoryWall(); return; }
      const memoryDot = event.target.closest('[data-memory-dot]'); if (memoryDot) { shuffleMemoryWall(1, Number(memoryDot.dataset.memoryDot)); restartMemoryWall(); return; }
      const galleryFilter = event.target.closest('[data-gallery-filter]'); if (galleryFilter) { state.galleryFilter = galleryFilter.dataset.galleryFilter; document.querySelectorAll('[data-gallery-filter]').forEach(button => button.classList.toggle('active',button===galleryFilter)); renderGallery(); return; }
      const galleryItem = event.target.closest('[data-gallery-index]'); if (galleryItem) { openLightbox(Number(galleryItem.dataset.galleryIndex)); return; }
      const searchProduct = event.target.closest('[data-search-product]'); if (searchProduct) { closeSearch(); state.productSearch = getProduct(searchProduct.dataset.searchProduct)?.name || ''; const shopSearch = document.getElementById('shopSearch'); if (shopSearch) shopSearch.value = state.productSearch; renderProducts(); navigate('shop'); return; }
      const tipButton = event.target.closest('[data-tip]'); if (tipButton) {
        const selectedTip = Number(tipButton.dataset.tip);
        state.tipPercent = state.customTip === 0 && state.tipPercent === selectedTip ? 0 : selectedTip;
        state.customTip = 0;
        const customTip = document.getElementById('customTip');
        if (customTip) customTip.value = '';
        renderCheckout();
        return;
      }
      const fulfillmentButton = event.target.closest('[data-fulfillment]'); if (fulfillmentButton) {
        state.fulfillment = fulfillmentButton.dataset.fulfillment;
        if (state.fulfillment !== 'delivery') {
          state.addressVerified = false;
          state.deliveryQuote = null;
          state.deliveryQuoteKey = '';
        } else {
          clearDeliveryQuote();
        }
        renderCheckout(); maybeLoadGooglePlaces(); return;
      }
      if (event.target.closest('[data-delivery-quote]')) { requestDeliveryQuote(); return; }
      const slideDot = event.target.closest('[data-slide-to]'); if (slideDot) { setHeroSlide(Number(slideDot.dataset.slideTo),true); return; }
      if (event.target.closest('[data-slide-prev]')) { setHeroSlide(state.heroIndex-1,true); return; }
      if (event.target.closest('[data-slide-next]')) { setHeroSlide(state.heroIndex+1,true); return; }
      if (event.target.closest('[data-slide-toggle]')) { toggleHeroTimer(); return; }
      const authTab = event.target.closest('[data-auth-tab]'); if (authTab) { document.querySelectorAll('[data-auth-tab]').forEach(button => button.classList.toggle('active',button===authTab)); document.getElementById('loginForm').hidden = authTab.dataset.authTab !== 'login'; document.getElementById('registerForm').hidden = authTab.dataset.authTab !== 'register'; return; }
      if (event.target.closest('[data-print-confirmation]')) { document.body.classList.remove('print-receipt'); window.print(); return; }
      if (event.target.closest('[data-logout]')) { logout(); return; }
    });
    document.addEventListener('change', event => {
      const variant = event.target.closest?.('[data-variant-select]');
      if (variant) refreshProductCardQuantities();
    });
    document.getElementById('shopSearch')?.addEventListener('input', event => { state.productSearch = event.target.value; renderProducts(); });
    document.getElementById('globalSearch')?.addEventListener('input', event => renderSearchResults(event.target.value));
    document.getElementById('customCakeForm')?.addEventListener('submit', handleCustomCakeSubmit); document.getElementById('checkoutForm')?.addEventListener('submit',handleCheckoutSubmit);
    document.getElementById('loginForm')?.addEventListener('submit',handleLogin); document.getElementById('registerForm')?.addEventListener('submit',handleRegister); document.getElementById('adminSettingsForm')?.addEventListener('submit',handleAdminSave); document.getElementById('adminPasswordForm')?.addEventListener('submit',handleAdminPasswordChange);
    document.getElementById('customDate')?.addEventListener('change', () => syncDateDisplay('customDate','customDateDisplay'));
    document.getElementById('fulfillmentDate')?.addEventListener('change', () => { syncDateDisplay('fulfillmentDate','fulfillmentDateDisplay'); populateTimeOptions(); });
    document.getElementById('customCakeForm')?.addEventListener('reset', () => window.setTimeout(() => syncDateDisplay('customDate','customDateDisplay'), 0));
    document.getElementById('checkoutForm')?.addEventListener('reset', () => window.setTimeout(() => syncDateDisplay('fulfillmentDate','fulfillmentDateDisplay'), 0));
    ['deliveryAddress','deliveryUnit','deliveryCity','deliveryZip'].forEach(id => document.getElementById(id)?.addEventListener('input',clearAddressVerification));
    window.addEventListener('hashchange',() => showRoute(safeRoute(location.hash.slice(1)))); window.addEventListener('popstate',() => showRoute(safeRoute(location.hash.slice(1))));

    // Phone swipe navigation. Bind to the page surface rather than the whole document,
    // and allow the gesture to start over normal content/cards. This is more reliable
    // in iOS Safari than the previous implementation, which excluded most tappable content.
    const swipeSurface = document.getElementById('appMain') || document;
    let swipeStartX = 0;
    let swipeStartY = 0;
    let swipeCurrentX = 0;
    let swipeCurrentY = 0;
    let swipeStartTime = 0;
    let swipeTracking = false;
    let swipeHorizontal = false;
    let suppressClickUntil = 0;

    swipeSurface.addEventListener('touchstart', event => {
      swipeTracking = false;
      swipeHorizontal = false;
      if (!isPhoneSwipeViewport() || mobileSwipeOverlayOpen() || event.touches.length !== 1 || !MOBILE_SWIPE_ROUTES.includes(state.route) || !mobileSwipeEligibleTarget(event.target)) return;
      const touch = event.touches[0];
      // Avoid fighting Safari's own back/forward edge gestures.
      if (touch.clientX < 22 || touch.clientX > window.innerWidth - 22) return;
      swipeStartX = swipeCurrentX = touch.clientX;
      swipeStartY = swipeCurrentY = touch.clientY;
      swipeStartTime = Date.now();
      swipeTracking = true;
    }, { passive:true, capture:true });

    swipeSurface.addEventListener('touchmove', event => {
      if (!swipeTracking || event.touches.length !== 1) return;
      const touch = event.touches[0];
      swipeCurrentX = touch.clientX;
      swipeCurrentY = touch.clientY;
      const deltaX = swipeCurrentX - swipeStartX;
      const deltaY = swipeCurrentY - swipeStartY;
      if (!swipeHorizontal && Math.abs(deltaX) >= 16 && Math.abs(deltaX) > Math.abs(deltaY) * 1.08) swipeHorizontal = true;
      // Once a deliberate horizontal swipe is established, keep the page from drifting.
      if (swipeHorizontal && event.cancelable) event.preventDefault();
    }, { passive:false, capture:true });

    swipeSurface.addEventListener('touchend', event => {
      if (!swipeTracking) return;
      if (event.changedTouches?.length) {
        swipeCurrentX = event.changedTouches[0].clientX;
        swipeCurrentY = event.changedTouches[0].clientY;
      }
      const deltaX = swipeCurrentX - swipeStartX;
      const deltaY = swipeCurrentY - swipeStartY;
      const elapsed = Date.now() - swipeStartTime;
      const isSwipe = Math.abs(deltaX) >= 46 && Math.abs(deltaX) > Math.abs(deltaY) * 1.12 && elapsed <= 1200;
      swipeTracking = false;
      swipeHorizontal = false;
      if (!isSwipe) return;
      suppressClickUntil = Date.now() + 450;
      // Right-to-left advances; left-to-right goes back.
      navigateByMobileSwipe(deltaX < 0 ? 1 : -1);
    }, { passive:true, capture:true });

    swipeSurface.addEventListener('touchcancel', () => { swipeTracking = false; swipeHorizontal = false; }, { passive:true, capture:true });
    document.addEventListener('click', event => {
      if (Date.now() < suppressClickUntil) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);

    let memoryResizeTimer; window.addEventListener('resize',() => { clearTimeout(memoryResizeTimer); memoryResizeTimer = setTimeout(() => { if (state.route === 'gallery') renderMemoryWall(true); },220); }, { passive:true });
    const galleryAudio = document.getElementById('galleryMusic'); galleryAudio?.addEventListener('play',() => { state.galleryMusicPlaying = true; updateGalleryMusicButton(); }); galleryAudio?.addEventListener('pause',() => { state.galleryMusicPlaying = false; updateGalleryMusicButton(); });
    window.addEventListener('keydown',event => {
      if (event.key === 'Escape') { closeCart(); closeSearch(); closeProductPreview(); closeLightbox(); closeReceipt(); document.getElementById('headerNav')?.classList.remove('open'); }
      if (document.getElementById('lightbox')?.classList.contains('open') && event.key === 'ArrowLeft') { event.preventDefault(); stepLightbox(-1); }
      if (document.getElementById('lightbox')?.classList.contains('open') && event.key === 'ArrowRight') { event.preventDefault(); stepLightbox(1); }
    });

    document.addEventListener('keydown', event => {
      const previewImage = document.getElementById('productPreviewImage');
      if (event.target === previewImage && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); toggleProductPreviewZoom(); return; }
      const previewTarget = event.target.closest?.('[data-product-preview]');
      const nestedControl = event.target.closest?.('button, a, input, select, textarea, label');
      if (previewTarget && !nestedControl && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); openProductPreview(previewTarget.dataset.productPreview); }
    });

    const previewZoomButton = document.getElementById('productPreviewZoomButton');
    const previewZoomImage = document.getElementById('productPreviewImage');
    previewZoomButton?.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      toggleProductPreviewZoom();
    });
    previewZoomImage?.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      toggleProductPreviewZoom();
    });

    document.getElementById('customFile')?.addEventListener('change',event => { addCustomFiles(event.target.files); event.target.value = ''; });
    document.querySelectorAll('input[name="paymentMethod"]').forEach(input=>input.addEventListener('change',()=>{ state.paymentMethod=input.value; document.querySelectorAll('.payment-choice-card').forEach(card=>card.classList.toggle('active',card.contains(input))); const cash=state.paymentMethod==='cash'; document.getElementById('squarePanel').hidden=cash; document.querySelector('.secure-note').hidden=cash; renderCheckout(); }));
    const customTipInput = document.getElementById('customTip');
    const clearPercentageTip = () => {
      if (state.tipPercent !== 0) {
        state.tipPercent = 0;
        renderCheckout();
      }
    };
    customTipInput?.addEventListener('focus', clearPercentageTip);
    customTipInput?.addEventListener('click', clearPercentageTip);
    customTipInput?.addEventListener('input', event => {
      const cleaned = event.target.value.replace(/[^0-9.]/g,'').replace(/(\..*)\./g,'$1');
      event.target.value = cleaned;
      state.customTip = Math.max(0, Number(cleaned) || 0);
      state.tipPercent = 0;
      document.querySelectorAll('[data-tip]').forEach(button => button.classList.remove('active'));
      renderCheckout();
    });
  }

  async function init() {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    renderHeroSlides(); renderHomeProducts(); renderProducts(); renderGallery(); renderCart(); renderSearchResults(''); bindEvents(); setCustomDateMinimum(); syncAllDateDisplays(); renderCustomFilePreviews();
    state.confetti = new ConfettiField();
    await loadPublicConfig(); renderCheckout(); await loadSession(); startHeroTimer();
    const initialRoute = safeRoute(location.hash.slice(1) || 'home'); navigate(initialRoute,{ replace:!location.hash });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
