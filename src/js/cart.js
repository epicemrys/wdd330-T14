// ✅ cart.js
import { getLocalStorage, updateCartCount } from "./utils.mjs";

// 🔹 Plantilla HTML para cada producto del carrito
function cartItemTemplate(item) {
  const imgSrc = item.Image?.startsWith("/") ? item.Image : `/${item.Image}`;

  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${imgSrc}" alt="${item.Name}" />
      </a>
      <div class="cart-card__details">
        <h2 class="card__name">${item.Name}</h2>
        <p class="cart-card__quantity">Qty: 1</p>
        <p class="cart-card__price">$${item.FinalPrice}</p>
      </div>
    </li>
  `;
}

// 🔹 Renderiza todos los productos del carrito
function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  let listEl = document.querySelector(".product-list");

  // ✅ Crear la lista si no existe (una sola vez, sin recursión)
  if (!listEl) {
    const main = document.querySelector("main");
    if (!main) {
      console.error("❌ No se encontró <main> en el documento.");
      return;
    }
    listEl = document.createElement("ul");
    listEl.classList.add("product-list");
    main.appendChild(listEl);
  }

  // ✅ Mostrar mensaje si el carrito está vacío
  if (!cartItems || cartItems.length === 0) {
    listEl.innerHTML = `<li>Your cart is empty.</li>`;
    const totalEl = document.querySelector(".cart-total");
    if (totalEl) totalEl.textContent = "$0.00";
    updateCartCount();
    return;
  }

  // ✅ Renderizar productos
  const htmlItems = cartItems.map((item) => cartItemTemplate(item)).join("");
  listEl.innerHTML = htmlItems;

  // ✅ Calcular total del carrito
  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.FinalPrice || 0),
    0
  );

  const totalEl = document.querySelector(".cart-total");
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

  updateCartCount();
}

// ✅ Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  renderCartContents();
  updateCartCount();
});
