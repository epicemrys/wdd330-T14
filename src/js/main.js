import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getLocalStorage } from './utils.mjs';

// Load header and footer
loadHeaderFooter();

document.addEventListener('DOMContentLoaded', () => {
  const dataSource = new ExternalServices('tents');
  const element = document.querySelector('.product-list');
  const productList = new ProductList('tents', dataSource, element);

  productList.init();
  updateCartBadge(); // refresh badge on page load
});

// Keep badge updated if localStorage changes
window.addEventListener("storage", updateCartBadge);