import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
    return `
        <li class="product-card">
            <a href="product_pages/?products=${product.Id}">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">$${product.price}</p>
            </a>
        </li>
    `;
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
            this.products = await this.dataSource.getData();
            this.renderProductList();
    }
    renderList(list) {
        renderListWithTemplate(productCardTemplate, this.listElement, list);
    }
}