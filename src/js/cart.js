import { loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

// Load header and footer, then initialize shopping cart
loadHeaderFooter();

// Wait a moment for DOM to be ready, then initialize shopping cart
document.addEventListener('DOMContentLoaded', () => {
  console.log("Cart page DOMContentLoaded event fired");
  const cartElement = document.querySelector(".product-list");
  console.log("Cart element found:", cartElement);
  console.log("Cart element HTML before init:", cartElement ? cartElement.innerHTML : "Element is null");

  if (cartElement) {
    const shoppingCart = new ShoppingCart(cartElement);
    shoppingCart.init();
    console.log("ShoppingCart initialized");
  } else {
    console.error("Could not find .product-list element");
  }
});
