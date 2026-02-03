import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter().then(async () => {
  await initCartBadge();
});

const category = getParam("category");

// Update the title to show the category
const categoryDisplay = category ? category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ") : "Products";
document.getElementById("product-title").textContent = `Top Products: ${categoryDisplay}`;

// first create an instance of the ExternalServices class.
const dataSource = new ExternalServices();
// then get the element you want the product list to render in
const listElement = document.querySelector(".product-list");
// then create an instance of the ProductList class and send it the correct information.
const myList = new ProductList(category, dataSource, listElement);
// finally call the init method to show the products
myList.init();
