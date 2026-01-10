import { setLocalStorage, getLocalStorage } from "./utils.mjs"; // Import getLocalStorage
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  const cartItems = getLocalStorage("so-cart") || [];
  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);
}

// add to cart button event handler
async function addToCartHandler(e) {
  // e.target.dataset.id should contain the ID of the product
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// Listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
