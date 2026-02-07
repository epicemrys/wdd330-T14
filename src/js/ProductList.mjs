import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="/product_pages/?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}" />
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
  `;
}

export default class ProductList {
  constructor({ category, searchTerm }, dataSource, listElement) {
    this.category = category;       // from URL or default
    this.searchTerm = searchTerm;   // from URL search
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    let list = [];

    try {
      if (this.searchTerm) {
        // If a search term exists, use search API
        list = await this.dataSource.searchData(this.searchTerm);
      } else {
        // Otherwise, get products by category
        list = await this.dataSource.getData(this.category || "tents");
      }
      this.renderList(list);
    } catch (error) {
      console.error("Failed to load products:", error);
      this.listElement.innerHTML = "<li>No products found.</li>";
    }
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", false);
  }
}
