import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  console.log("Cart items:", cartItems);

  if (!cartItems || cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML = "<p>Your cart is empty</p>";
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Add event listeners for quantity buttons
  document.querySelectorAll(".quantity-btn").forEach(btn => {
    btn.addEventListener("click", handleQuantityChange);
  });

  // Add event listeners for remove buttons
  document.querySelectorAll(".cart-card__remove").forEach(btn => {
    btn.addEventListener("click", handleRemoveItem);
  });
}

function cartItemTemplate(item) {
  const quantity = item.quantity || 1;
  const newItem = `<li class="cart-card divider">
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

  return newItem;
}

function handleQuantityChange(e) {
  const btn = e.target;
  const productId = btn.dataset.id;
  const action = btn.dataset.action;
  const cartItems = getLocalStorage("so-cart") || [];

  const item = cartItems.find(cartItem => cartItem.Id === productId);
  if (item) {
    item.quantity = item.quantity || 1;
    if (action === "increase") {
      item.quantity++;
    } else if (action === "decrease") {
      item.quantity--;
      // Remove item if quantity reaches 0
      if (item.quantity <= 0) {
        const index = cartItems.indexOf(item);
        cartItems.splice(index, 1);
      }
    }
    setLocalStorage("so-cart", cartItems);
    renderCartContents();
  }
}

function handleRemoveItem(e) {
  const btn = e.target;
  const productId = btn.dataset.id;
  let cartItems = getLocalStorage("so-cart") || [];

  cartItems = cartItems.filter(item => item.Id !== productId);
  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}

renderCartContents();
