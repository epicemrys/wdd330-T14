// product-listing.js
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam, updateCartBadge } from "./utils.mjs";

// Load header and footer
loadHeaderFooter();

// Default category if none provided
const DEFAULT_CATEGORY = "tents";
const category = getParam("category") || DEFAULT_CATEGORY;

// Get search term from URL (if any)
const searchTerm = getParam("search")?.toLowerCase() || null;

// Set page title dynamically
const titleElement = document.getElementById("product-title");
if (searchTerm) {
  titleElement.textContent = `Search results for "${searchTerm}"`;
} else {
  const categoryDisplay = category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ");
  titleElement.textContent = `Top Products: ${categoryDisplay}`;
}

// Initialize data source
const dataSource = new ExternalServices();
const listElement = document.querySelector(".product-list");

// Initialize ProductList with category AND searchTerm
const myList = new ProductList(category, dataSource, listElement, searchTerm);
myList.init();

// Update cart badge on page load and on storage changes
updateCartBadge();
window.addEventListener("storage", updateCartBadge);
