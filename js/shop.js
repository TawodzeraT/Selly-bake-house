// ================================
// SELLY BAKE HOUSE — SHOP PAGE
// Filtering, search, rendering
// ================================

let currentCategory = "All";
let currentSearch   = "";

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  initFilters();
  initSearch();

  // Check URL for category param
  const params = new URLSearchParams(window.location.search);
  const cat = params.get("cat");
  if (cat) {
    currentCategory = cat;
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.cat === cat);
    });
    renderProducts();
  }
});

function initFilters() {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      currentCategory = btn.dataset.cat || "All";
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderProducts();
    });
  });
}

function initSearch() {
  const searchInput = document.getElementById("shop-search");
  if (!searchInput) return;
  searchInput.addEventListener("input", e => {
    currentSearch = e.target.value.trim().toLowerCase();
    renderProducts();
  });
}

function getFilteredProducts() {
  const products = SBH.getProducts();
  return products.filter(p => {
    const catMatch = currentCategory === "All" || p.category === currentCategory;
    const searchMatch = !currentSearch ||
      p.name.toLowerCase().includes(currentSearch) ||
      p.desc.toLowerCase().includes(currentSearch) ||
      p.category.toLowerCase().includes(currentSearch);
    return catMatch && searchMatch;
  });
}

function renderProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  const products = getFilteredProducts();
  const count = document.getElementById("product-count");
  if (count) count.textContent = `${products.length} item${products.length !== 1 ? "s" : ""}`;

  if (products.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:4rem 2rem;color:var(--text-muted)">
        <div style="font-size:3rem;margin-bottom:.8rem">🔍</div>
        <h3 class="serif" style="font-size:1.8rem;color:var(--brown-dark);margin-bottom:.4rem">No results found</h3>
        <p>Try adjusting your search or category filter</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(p => buildProductCard(p)).join("");
}
