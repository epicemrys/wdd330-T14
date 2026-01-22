import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-price">$${product.price}</p>
        </div>
    `;
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
        this.products = [];
    }

    async init() {
        try {
            this.products = await this.dataSource.getData();
            this.renderProductList();
        } catch (error) {
            console.error('Error initializing ProductList:', error);
        }
    }
    renderList(list) {
        renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);
    }
}