import { loadHeaderFooter, getLocalStorage, updateCartBadge } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

// Load header and footer
loadHeaderFooter();

document.addEventListener('DOMContentLoaded', () => {
  const cartElement = document.querySelector(".product-list");

  if (cartElement) {
    const shoppingCart = new ShoppingCart(cartElement);
    shoppingCart.init();
    updateCartBadge(); // refresh badge on page load
  } else {
    console.error("Could not find .product-list element");
  }
});

// Keep badge updated if localStorage changes
window.addEventListener("storage", updateCartBadge);