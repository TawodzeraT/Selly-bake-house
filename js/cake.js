// ================================
// SELLY BAKE HOUSE — CUSTOM CAKE
// Multi-step cake order form
// ================================

let cakeStep = 1;
const TOTAL_STEPS = 4;
const cakeForm = {
  name: "", email: "", phone: "",
  size: "", flavor: "", frosting: "", filling: "None",
  design: "", addons: [],
  date: "", method: "pickup", notes: ""
};

document.addEventListener("DOMContentLoaded", () => {
  checkCakeAccess();
  initCakeForm();
  populateCakeOptions();
  updateStepDisplay();
});

function checkCakeAccess() {
  const settings = SBH.getSettings();
  const user = SBH.getUser();
  const disabledSection = document.getElementById("cakes-disabled");
  const loginSection    = document.getElementById("login-required");
  const formSection     = document.getElementById("cake-form-section");

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
  const user_ = SBH.getUser();
  if (user_) {
    setValue("cake-name",  user_.name  || "");
    setValue("cake-email", user_.email || "");
    setValue("cake-phone", user_.phone || "");
  }
}

function populateCakeOptions() {
  const opts = SBH.cakeOptions;

  populateSelect("cake-size",     opts.sizes.map(s => ({ value: s.value, label: s.label })));
  populateSelect("cake-flavor",   opts.flavors.map(f  => ({ value: f, label: f })));
  populateSelect("cake-frosting", opts.frostings.map(f => ({ value: f, label: f })));
  populateSelect("cake-filling",  opts.fillings.map(f  => ({ value: f, label: f })));

  // Addons checkboxes
  const addonsContainer = document.getElementById("cake-addons");
  if (addonsContainer) {
    addonsContainer.innerHTML = opts.addons.map(a => `
      <label style="display:flex;align-items:center;gap:.5rem;font-size:.88rem;font-weight:600;color:var(--brown-dark);cursor:pointer;margin-bottom:.4rem">
        <input type="checkbox" value="${a}" style="accent-color:var(--rose-deep)"> ${a}
      </label>
    `).join("");
  }
}

function populateSelect(id, options) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = options.map(o => `<option value="${o.value}">${o.label}</option>`).join("");
}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function initCakeForm() {
  // Step navigation
  const nextBtns = document.querySelectorAll(".step-next");
  const prevBtns = document.querySelectorAll(".step-prev");

  nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (validateStep(cakeStep)) {
        saveStepData(cakeStep);
        cakeStep++;
        if (cakeStep > TOTAL_STEPS) cakeStep = TOTAL_STEPS;
        updateStepDisplay();
        if (cakeStep === TOTAL_STEPS) renderReview();
        window.scrollTo({ top: 200, behavior: "smooth" });
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      cakeStep--;
      if (cakeStep < 1) cakeStep = 1;
      updateStepDisplay();
      window.scrollTo({ top: 200, behavior: "smooth" });
    });
  });

  // Submit
  const submitBtn = document.getElementById("cake-submit");
  if (submitBtn) {
    submitBtn.addEventListener("click", submitCakeRequest);
  }
}

function validateStep(step) {
  const errors = {
    1: () => {
      if (!getValue("cake-name"))  { showToast("⚠️ Please enter your name."); return false; }
      if (!getValue("cake-email")) { showToast("⚠️ Please enter your email."); return false; }
      if (!getValue("cake-phone")) { showToast("⚠️ Please enter your phone number."); return false; }
      return true;
    },
    2: () => {
      if (!getValue("cake-design")) { showToast("⚠️ Please describe your design."); return false; }
      return true;
    },
    3: () => {
      if (!getValue("cake-date")) { showToast("⚠️ Please select a date needed."); return false; }
      const selected = new Date(getValue("cake-date"));
      const minDate  = new Date();
      minDate.setDate(minDate.getDate() + 3);
      if (selected < minDate) { showToast("⚠️ Please allow at least 3 days lead time."); return false; }
      return true;
    },
    4: () => true
  };
  return (errors[step] || (() => true))();
}

function saveStepData(step) {
  if (step === 1) {
    cakeForm.name  = getValue("cake-name");
    cakeForm.email = getValue("cake-email");
    cakeForm.phone = getValue("cake-phone");
  }
  if (step === 2) {
    cakeForm.size     = getValue("cake-size");
    cakeForm.flavor   = getValue("cake-flavor");
    cakeForm.frosting = getValue("cake-frosting");
    cakeForm.filling  = getValue("cake-filling");
    cakeForm.design   = getValue("cake-design");
    const checkboxes = document.querySelectorAll("#cake-addons input:checked");
    cakeForm.addons = Array.from(checkboxes).map(c => c.value);
  }
  if (step === 3) {
    cakeForm.date   = getValue("cake-date");
    cakeForm.method = getValue("cake-method");
    cakeForm.notes  = getValue("cake-notes");
  }
}

function updateStepDisplay() {
  // Step bar
  document.querySelectorAll(".step-item").forEach((item, idx) => {
    item.classList.remove("active", "done");
    const stepNum = idx + 1;
    if (stepNum < cakeStep)  item.classList.add("done");
    if (stepNum === cakeStep) item.classList.add("active");
  });

  // Show/hide step panels
  document.querySelectorAll(".step-panel").forEach(panel => {
    panel.style.display = parseInt(panel.dataset.step) === cakeStep ? "block" : "none";
  });
}

function renderReview() {
  const reviewBody = document.getElementById("review-body");
  if (!reviewBody) return;

  const rows = [
    ["Your Name",   cakeForm.name],
    ["Email",       cakeForm.email],
    ["Phone",       cakeForm.phone],
    ["Cake Size",   cakeForm.size],
    ["Flavor",      cakeForm.flavor],
    ["Frosting",    cakeForm.frosting],
    ["Filling",     cakeForm.filling],
    ["Design",      cakeForm.design],
    ["Add-ons",     cakeForm.addons.length ? cakeForm.addons.join(", ") : "None"],
    ["Date Needed", cakeForm.date],
    ["Method",      cakeForm.method === "pickup" ? "Pickup — 721 Fallsgrove Dr, Rockville MD" : "Delivery (Maryland only)"],
    ["Notes",       cakeForm.notes || "—"]
  ];

  reviewBody.innerHTML = rows.map(([label, value]) => `
    <tr>
      <td>${label}</td>
      <td>${value}</td>
    </tr>
  `).join("");
}

function submitCakeRequest() {
  const btn = document.getElementById("cake-submit");
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Submitting...';

  // Generate request ID
  const reqId = "CR-" + Date.now().toString().slice(-6);
  const request = {
    id: reqId,
    ...cakeForm,
    status: "pending",
    submitted: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  };

  SBH.saveCakeRequest(request);

  /* =====================================================
   * EMAIL NOTIFICATION (Backend)
   * Send confirmation email to customer and
   * notification email to Selina.
   *
   * POST /api/cake-request
   * Body: request object
   *
   * Server should use SendGrid / Mailgun to email:
   *   - Customer: confirmation + request summary
   *   - Admin: new request notification
   * ===================================================== */

  setTimeout(() => {
    const successSection  = document.getElementById("cake-success");
    const formSection     = document.getElementById("cake-form-section");
    const successOrderId  = document.getElementById("success-order-id");

    if (formSection)    formSection.style.display    = "none";
    if (successSection) successSection.style.display = "block";
    if (successOrderId) successOrderId.textContent   = reqId;

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 1500);
}
