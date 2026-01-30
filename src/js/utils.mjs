// 🔍 Wrapper for querySelector - returns the matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// 📦 Retrieve data safely from localStorage
export function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : []; // ✅ Prevents "null" errors
}

// 💾 Save data to localStorage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// 👆 Add listeners for both click and touch
export function setClick(selector, callback) {
  const element = qs(selector);
  if (!element) return;
  element.addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  element.addEventListener("click", callback);
}

// 🆔 Get parameter from query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// 🧱 Render list dynamically using a template function
export function renderListWithTemplate(
  template,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  const htmlStrings = list.map(template);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// 🛒 Update the cart count on the icon
export function updateCartCount() {
  const cart = getLocalStorage("so-cart");
  const countEl = document.querySelector("#cart-count");

  if (!countEl) return; // ✅ Avoid null reference errors

  countEl.textContent = cart.length > 0 ? cart.length : "";
  countEl.style.display = cart.length === 0 ? "none" : "inline-block";
}
export function alertMessage(message, scroll = true) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `
    <p>${message}</p>
    <button class="alert-close" aria-label="Close">&times;</button>
  `;

  const main = document.querySelector("main");
  main.prepend(alert);

  alert.querySelector(".alert-close").addEventListener("click", () => {
    alert.remove();
  });

  if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
}
