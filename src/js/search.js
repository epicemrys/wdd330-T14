const params = new URLSearchParams(window.location.search);
const searchTerm = params.get("search")?.trim().toLowerCase();

async function getAllProducts() {
  try {
    const response = await fetch('https://wdd330-backend.herokuapp.com/products');
    if (!response.ok) throw new Error("Network response not ok");
    return await response.json();
  } catch (err) {
    console.error("Failed to fetch products", err);
    return [];
  }
}

function renderResults(products, term) {
  const container = document.querySelector(".product-list");
  if (!container) return;

  // Filter by search term
  const filtered = products.filter(product =>
    product.Name.toLowerCase().includes(term)
  );

  if (!filtered.length) {
    container.innerHTML = `<p>No products found for "<strong>${term}</strong>".</p>`;
    return;
  }

  const regex = new RegExp(term, "gi"); // Highlight term

  container.innerHTML = filtered.map(product => `
    <li class="product-card">
      <a href="/product_pages/${product.Id}.html">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}" />
        <h3>${product.Name.replace(regex, match => `<span class="highlight">${match}</span>`)}</h3>
        <p>$${product.FinalPrice}</p>
      </a>
    </li>
  `).join("");
}

async function initSearch() {
  if (!searchTerm) return;

  const container = document.querySelector(".product-list");
  if (!container) return;

  container.innerHTML = `<p>Loading results for "<strong>${searchTerm}</strong>"...</p>`;

  const products = await getAllProducts();
  renderResults(products, searchTerm);
}

initSearch();
