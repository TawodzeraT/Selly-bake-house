/* =============================================
   SELLY BAKE HOUSE — CAKE JS
   Handles the custom cake order form
   ============================================= */

var currentStep  = 1;
var totalSteps   = 4;
var cakeImageData = null;

var cakeForm = {
  name:"", email:"", phone:"",
  size:"", flavor:"", frosting:"", filling:"", design:"", addons:[],
  date:"", method:"pickup", notes:""
};

document.addEventListener("DOMContentLoaded", function() {
  checkCakeAccess();
});

/* ---- CHECK ACCESS ---- */
function checkCakeAccess() {
  var settings       = SBH.getSettings();
  var user           = SBH.getUser();
  var disabledSection = document.getElementById("cakes-disabled");
  var loginSection    = document.getElementById("login-required");
  var formSection     = document.getElementById("cake-form-section");

  if (!settings.cakesEnabled) {
    if (disabledSection) disabledSection.style.display = "block";
    if (loginSection)    loginSection.style.display    = "none";
    if (formSection)     formSection.style.display     = "none";
    return;
  }

  if (!user) {
    if (disabledSection) disabledSection.style.display = "none";
    if (loginSection)    loginSection.style.display    = "block";
    if (formSection)     formSection.style.display     = "none";
    return;
  }

  if (disabledSection) disabledSection.style.display = "none";
  if (loginSection)    loginSection.style.display    = "none";
  if (formSection)     formSection.style.display     = "block";

  // Pre-fill user info
  var nameEl  = document.getElementById("cake-name");
  var emailEl = document.getElementById("cake-email");
  var phoneEl = document.getElementById("cake-phone");
  if (nameEl  && user.name)  nameEl.value  = user.name;
  if (emailEl && user.email) emailEl.value = user.email;
  if (phoneEl && user.phone) phoneEl.value = user.phone;
}

/* ---- STEP NAVIGATION ---- */
function nextStep(from) {
  if (!validateStep(from)) return;
  saveStepData(from);
  currentStep = from + 1;
  if (currentStep > totalSteps) currentStep = totalSteps;
  updateStepDisplay();
  if (currentStep === 4) buildReviewPage();
  window.scrollTo({ top: 200, behavior: "smooth" });
}

function prevStep(from) {
  currentStep = from - 1;
  if (currentStep < 1) currentStep = 1;
  updateStepDisplay();
  window.scrollTo({ top: 200, behavior: "smooth" });
}

function updateStepDisplay() {
  // Update step bar
  document.querySelectorAll(".step-item").forEach(function(item) {
    var stepNum = parseInt(item.dataset.step);
    item.classList.remove("active","done");
    if (stepNum < currentStep)  item.classList.add("done");
    if (stepNum === currentStep) item.classList.add("active");
  });

  // Show correct panel
  for (var i = 1; i <= totalSteps; i++) {
    var panel = document.getElementById("step-panel-" + i);
    if (panel) panel.style.display = i === currentStep ? "block" : "none";
  }
}

/* ---- VALIDATION ---- */
function validateStep(step) {
  if (step === 1) {
    var name  = document.getElementById("cake-name").value.trim();
    var email = document.getElementById("cake-email").value.trim();
    var phone = document.getElementById("cake-phone").value.trim();
    if (!name)  { showToast("Please enter your full name."); return false; }
    if (!email) { showToast("Please enter your email address."); return false; }
    if (!phone) { showToast("Please enter your phone number."); return false; }
    return true;
  }
  if (step === 2) {
    var design = document.getElementById("cake-design").value.trim();
    if (!design) { showToast("Please describe your cake design."); return false; }
    return true;
  }
  if (step === 3) {
    var date = document.getElementById("cake-date").value;
    if (!date) { showToast("Please select the date you need your cake."); return false; }
    var selectedDate = new Date(date);
    var minDate      = new Date();
    minDate.setDate(minDate.getDate() + 3);
    if (selectedDate < minDate) {
      showToast("Please allow at least 3 days lead time for custom orders.");
      return false;
    }
    return true;
  }
  return true;
}

/* ---- SAVE STEP DATA ---- */
function saveStepData(step) {
  if (step === 1) {
    cakeForm.name  = document.getElementById("cake-name").value.trim();
    cakeForm.email = document.getElementById("cake-email").value.trim();
    cakeForm.phone = document.getElementById("cake-phone").value.trim();
  }
  if (step === 2) {
    cakeForm.size     = document.getElementById("cake-size").value;
    cakeForm.flavor   = document.getElementById("cake-flavor").value;
    cakeForm.frosting = document.getElementById("cake-frosting").value;
    cakeForm.filling  = document.getElementById("cake-filling").value;
    cakeForm.design   = document.getElementById("cake-design").value.trim();
    var checked = document.querySelectorAll(".cake-addon:checked");
    cakeForm.addons   = Array.from(checked).map(function(c) { return c.value; });
  }
  if (step === 3) {
    cakeForm.date   = document.getElementById("cake-date").value;
    cakeForm.method = document.getElementById("cake-method").value;
    cakeForm.notes  = document.getElementById("cake-notes").value.trim();
  }
}

/* ---- BUILD REVIEW PAGE ---- */
function buildReviewPage() {
  var rows = [
    ["Name",        cakeForm.name],
    ["Email",       cakeForm.email],
    ["Phone",       cakeForm.phone],
    ["Cake Size",   cakeForm.size],
    ["Flavor",      cakeForm.flavor],
    ["Frosting",    cakeForm.frosting],
    ["Filling",     cakeForm.filling],
    ["Add-ons",     cakeForm.addons.length ? cakeForm.addons.join(", ") : "None"],
    ["Design",      cakeForm.design],
    ["Date Needed", cakeForm.date],
    ["Method",      cakeForm.method === "pickup" ? "Pickup — 721 Fallsgrove Dr, Rockville MD" : "Delivery (Maryland only)"],
    ["Notes",       cakeForm.notes || "None"]
  ];

  var tbody = document.getElementById("review-body");
  if (tbody) {
    tbody.innerHTML = rows.map(function(r) {
      return "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td></tr>";
    }).join("");
  }

  // Show image preview in review if uploaded
  var reviewImgContainer = document.getElementById("review-image-container");
  var reviewImg           = document.getElementById("review-preview-img");
  if (cakeImageData && reviewImgContainer && reviewImg) {
    reviewImg.src = cakeImageData;
    reviewImgContainer.style.display = "block";
  } else if (reviewImgContainer) {
    reviewImgContainer.style.display = "none";
  }
}

/* ---- IMAGE UPLOAD ---- */
function handleImageSelect(input) {
  if (!input.files || !input.files[0]) return;
  var file = input.files[0];
  if (file.size > 5 * 1024 * 1024) {
    showToast("Image is too large. Please use an image under 5MB.");
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) { setImagePreview(e.target.result); };
  reader.readAsDataURL(file);
}

function handleImageDrop(event) {
  event.preventDefault();
  var area = document.getElementById("image-upload-area");
  if (area) { area.style.borderColor = "var(--cream-mid)"; area.style.background = "var(--cream)"; }
  var file = event.dataTransfer.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    showToast("Please drop an image file.");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showToast("Image is too large. Please use an image under 5MB.");
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) { setImagePreview(e.target.result); };
  reader.readAsDataURL(file);
}

function setImagePreview(dataUrl) {
  cakeImageData = dataUrl;
  var img         = document.getElementById("preview-img");
  var placeholder = document.getElementById("image-placeholder");
  var previewBox  = document.getElementById("image-preview-box");
  if (img)         img.src = dataUrl;
  if (placeholder) placeholder.style.display = "none";
  if (previewBox)  previewBox.style.display  = "block";
}

function removeImage() {
  cakeImageData = null;
  var input       = document.getElementById("cake-image-input");
  var placeholder = document.getElementById("image-placeholder");
  var previewBox  = document.getElementById("image-preview-box");
  if (input)       input.value               = "";
  if (placeholder) placeholder.style.display = "block";
  if (previewBox)  previewBox.style.display  = "none";
}

/* ---- SUBMIT ---- */
function submitCakeRequest() {
  var btn = document.getElementById("submit-btn");
  if (btn) {
    btn.disabled    = true;
    btn.innerHTML   = '<span class="spinner"></span> Submitting...';
  }

  var reqId = "CR" + Date.now().toString().slice(-6);

  var request = {
    id:        reqId,
    name:      cakeForm.name,
    email:     cakeForm.email,
    phone:     cakeForm.phone,
    size:      cakeForm.size,
    flavor:    cakeForm.flavor,
    frosting:  cakeForm.frosting,
    filling:   cakeForm.filling,
    design:    cakeForm.design,
    addons:    cakeForm.addons,
    date:      cakeForm.date,
    method:    cakeForm.method,
    notes:     cakeForm.notes,
    imageData: cakeImageData || null,
    status:    "pending",
    submitted: new Date().toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" })
  };

  SBH.saveCakeRequest(request);

  setTimeout(function() {
    var formSection    = document.getElementById("cake-form-section");
    var successSection = document.getElementById("cake-success");
    var successOrderId = document.getElementById("success-order-id");

    if (formSection)    formSection.style.display    = "none";
    if (successSection) successSection.style.display = "block";
    if (successOrderId) successOrderId.textContent   = reqId;

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 1200);
}
