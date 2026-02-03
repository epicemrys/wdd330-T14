import { getLocalStorage, setLocalStorage, dispatchCartChange } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // Fetch product details
    this.product = await this.dataSource.findProductById(this.productId);

    // Render the product once we have the data
    this.renderProductDetails();

    // Add click listener to "Add to Cart" button
    const addBtn = document.getElementById("addToCart");
    if (addBtn) {
      addBtn.addEventListener("click", this.addProductToCart.bind(this));
    } else {
      console.warn("Add to Cart button (#addToCart) not found on this page");
    }
  }

  addProductToCart() {
    let cartItems = getLocalStorage("so-cart") || [];

    // Ensure it's always an array
    if (!Array.isArray(cartItems)) {
      cartItems = [];
    }

    console.log("Adding to cart:", this.product);

    // Check if product already exists in cart
    const existingItemIndex = cartItems.findIndex(
      (item) => item.Id === this.product.Id
    );

    if (existingItemIndex !== -1) {
      // Item exists → increment quantity
      cartItems[existingItemIndex].quantity =
        (cartItems[existingItemIndex].quantity || 1) + 1;
      console.log(
        "Item already in cart → new quantity:",
        cartItems[existingItemIndex].quantity
      );
    } else {
      // New item → add with quantity 1
      const newItem = { ...this.product, quantity: 1 };
      cartItems.push(newItem);
      console.log("New item added to cart");
    }

    // Save updated cart
    setLocalStorage("so-cart", cartItems);

    // VERY IMPORTANT: Notify all pages that the cart changed
    dispatchCartChange();

    alert("Item added to cart!");
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  // Brand
  const brandEl = document.querySelector("main h2");
  if (brandEl) brandEl.textContent = product.Brand?.Name || "";

  // Product name
  const nameEl = document.querySelector("main h3");
  if (nameEl) nameEl.textContent = product.NameWithoutBrand || product.Name || "";

  document.getElementById('addToCart').dataset.id = product.Id;
}