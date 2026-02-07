import { renderListWithTemplate, getLocalStorage, setLocalStorage } from "./utils.mjs";

function cartItemTemplate(item) {
  const quantity = item.quantity || 1;
  return `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">
    qty: <span class="quantity-value">${quantity}</span>
    <button class="quantity-btn" data-id="${item.Id}" data-action="decrease">-</button>
    <button class="quantity-btn" data-id="${item.Id}" data-action="increase">+</button>
  </p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <button class="cart-card__remove" data-id="${item.Id}">Remove</button>
</li>`;
}

export default class ShoppingCart {
  constructor(listElement) {
    this.listElement = listElement;
    this.cartItems = [];
  }

  init() {
    let items = getLocalStorage("so-cart");

    // Defensive fix (W01): ensure cart is always an array
    if (!Array.isArray(items)) {
      // If the stored cart is corrupted or not an array, reset it.
      items = [];
      setLocalStorage("so-cart", items);
    }

    this.cartItems = items;
    this.renderCart();
    this.updateCartTotals();
    this.attachEventListeners();
    this.attachCheckoutHandler();
    this.updateCartBadge();
  }

  logCorruptedCartWarning() {
    /* eslint-disable-next-line no-console */
    console.warn("Corrupted cart detected in LocalStorage. Resetting.");
  }
  
  renderCart() {
    if (!this.cartItems || this.cartItems.length === 0) {
      this.listElement.innerHTML = "<p>Your cart is empty</p>";
      this.updateCartBadge();
      return;
    }

    this.listElement.innerHTML = "";
    renderListWithTemplate(cartItemTemplate, this.listElement, this.cartItems, "beforeend", false);
    this.updateCartBadge();
  }

  attachEventListeners() {
    this.listElement.querySelectorAll(".quantity-btn").forEach(btn => {
      btn.addEventListener("click", (e) => this.handleQuantityChange(e));
    });

    this.listElement.querySelectorAll(".cart-card__remove").forEach(btn => {
      btn.addEventListener("click", (e) => this.handleRemoveItem(e));
    });
  }

  handleQuantityChange(e) {
    const btn = e.target;
    const productId = btn.dataset.id;
    const action = btn.dataset.action;

    const item = this.cartItems.find(cartItem => cartItem.Id === productId);
    if (item) {
      item.quantity = item.quantity || 1;
      if (action === "increase") {
        item.quantity++;
      } else if (action === "decrease") {
        item.quantity--;
        if (item.quantity <= 0) {
          const index = this.cartItems.indexOf(item);
          this.cartItems.splice(index, 1);
        }
      }
      setLocalStorage("so-cart", this.cartItems);
      this.renderCart();
      this.updateCartTotals();
      this.attachEventListeners();
      this.updateCartBadge();
    }
  }

  handleRemoveItem(e) {
    const btn = e.target;
    const productId = btn.dataset.id;

    this.cartItems = this.cartItems.filter(item => item.Id !== productId);
    setLocalStorage("so-cart", this.cartItems);
    this.renderCart();
    this.updateCartTotals();
    this.attachEventListeners();
    this.updateCartBadge();
  }

  updateCartTotals() {
    let subtotal = 0;
    this.cartItems.forEach(item => {
      const quantity = item.quantity || 1;
      subtotal += parseFloat(item.FinalPrice) * quantity;
    });

    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    const subtotalEl = document.getElementById("cart-subtotal");
    const taxEl = document.getElementById("cart-tax");
    const totalEl = document.getElementById("cart-total");

    if (subtotalEl) subtotalEl.textContent = "$" + subtotal.toFixed(2);
    if (taxEl) taxEl.textContent = "$" + tax.toFixed(2);
    if (totalEl) totalEl.textContent = "$" + total.toFixed(2);

    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.disabled = this.cartItems.length === 0;
    }
  }

  attachCheckoutHandler() {
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        window.location.href = "/checkout/index.html";
      });
    }
  }

  updateCartBadge() {
    const count = this.cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const badge = document.querySelector(".cart-count");
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? "inline-block" : "none";
    }
  }
}