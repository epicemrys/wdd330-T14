// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// get the product id from the query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product
}

export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  if (clear) {
    parentElement.innerHTML = "";
  }

  const htmlStrings = list.map(item => templateFn(item));
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElement = document.querySelector("#header");
  const footerElement = document.querySelector("#footer");
  

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}

export function dispatchCartChange() {
  window.dispatchEvent(new CustomEvent('cartchanged'));
}

// Call this after every cart modification
export function updateCartCount() {
  const cart = getLocalStorage("so-cart") || [];
  console.log("[updateCartCount] cart length =", cart.length, "items");
  
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  console.log("[updateCartCount] total quantity =", totalItems);

  const countEl = document.getElementById("cart-count");
  if (countEl) {
    console.log("[updateCartCount] #cart-count element found");
    countEl.textContent = totalItems || "0";
    countEl.classList.toggle("hidden", totalItems === 0);
  } else {
    console.log("[updateCartCount] #cart-count NOT found on this page");
  }
}

// Listen for cart changes on every page and update the badge
document.addEventListener('cartchanged', () => {
  console.log("Cart changed event received → updating count");
  updateCartCount();
});

// Also update count when page loads (after header is ready)
export async function initCartBadge() {
  await loadHeaderFooter();           // ensure header is inserted
  updateCartCount();                  // now #cart-count should exist
  console.log("Cart badge initialized after header load");  
}

// Listen for cart changes (this should only be added once)
let cartListenerAdded = false;
export function addCartChangeListener() {
  if (cartListenerAdded) return;
  cartListenerAdded = true;
  
  window.addEventListener('cartchanged', () => {
    console.log("cartchanged event → updating badge");
    updateCartCount();
  });
  console.log("Cart change listener registered");
}