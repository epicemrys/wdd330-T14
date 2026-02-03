import { 
  loadHeaderFooter, 
  getLocalStorage, 
  setLocalStorage, 
  updateCartCount,
  dispatchCartChange,       // ← add this import
  initCartBadge             // ← add this if you implemented it in utils.mjs
} from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

function cartItemTemplate(item) {
  const quantity = item.quantity || 1;
  const total = (parseFloat(item.FinalPrice) * quantity).toFixed(2);
  return `
    <li class="checkout-item divider">
      <div class="item-details">
        <h4>${item.Name}</h4>
        <p>Color: ${item.Colors?.[0]?.ColorName || "N/A"}</p>
        <p>Quantity: ${quantity}</p>
        <p>Unit Price: $${item.FinalPrice}</p>
      </div>
      <div class="item-total">
        <p>$${total}</p>
      </div>
    </li>
  `;
}

document.addEventListener("DOMContentLoaded", async () => {
  console.log("checkout.js → DOMContentLoaded started");

  // 1. Ensure header & footer are loaded and badge is initialized
  await loadHeaderFooter();
  console.log("Header & footer loaded");

  // 2. Update cart count now that DOM elements should exist
  await updateCartCount();   // or await initCartBadge() if you added that helper

  // 3. Load cart items
  const cartItems = getLocalStorage("so-cart") || [];
  console.log("Cart items loaded in checkout:", cartItems.length, "items");

  const cartList = document.querySelector(".cart-list");
  const placeOrderBtn = document.getElementById("place-order-btn");

  if (!cartList) {
    console.error("Cannot find .cart-list element on checkout page");
    return;
  }

  // Show empty cart message and disable button if needed
  if (cartItems.length === 0) {
    cartList.innerHTML = `<li><p>Your cart is empty. <a href="/index.html">Continue shopping</a></p></li>`;
    if (placeOrderBtn) placeOrderBtn.disabled = true;
    return;
  }

  // 4. Render cart items list
  cartList.innerHTML = cartItems.map(cartItemTemplate).join("");

  // 5. Initialize totals & ZIP listener
  const checkoutProcess = new CheckoutProcess(cartItems);
  checkoutProcess.init();

  document.getElementById("zip")?.addEventListener("input", () => {
    checkoutProcess.displayTotals();
  });

  // 6. Form submission handler
  document.getElementById("checkout-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (placeOrderBtn) {
      placeOrderBtn.disabled = true;
      placeOrderBtn.textContent = "Processing...";
    }

    try {
      await checkoutProcess.checkout(e.target);
      // Success → cart is cleared inside checkout(), alert + redirect already handled
      // Make sure other tabs/pages see the cleared cart
      dispatchCartChange();           // ← important!
    } catch (err) {
      console.error("Order submission failed:", err);
      alert("There was a problem processing your order. Please try again.");
    } finally {
      if (placeOrderBtn) {
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = "Checkout";
      }
    }
  });

  // Final safety update
  updateCartCount();
  console.log("checkout.js → initialization complete");
});