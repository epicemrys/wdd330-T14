import { loadHeaderFooter, updateCartBadge } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

// Load header and footer
loadHeaderFooter();

class Checkout {
  constructor() {
    this.checkoutProcess = new CheckoutProcess();
  }

  init() {
    this.checkoutProcess.init();
    this.attachFormHandler();
    updateCartBadge(); // refresh badge on page load
  }

  attachFormHandler() {
    const form = document.getElementById("checkout-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.checkoutProcess.checkout(form);
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const checkout = new Checkout();
  checkout.init();
});

// Keep badge updated if localStorage changes
window.addEventListener("storage", updateCartBadge);