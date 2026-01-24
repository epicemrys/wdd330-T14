import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const dataSource = new ProductData("tents");
const productID = getParam("product");

const product = new ProductDetails(productID, dataSource);
product.init();

// Add to cart functionality - OLD CODE BEFORE REFACTORING INTO PRODUCTDETAILS CLASS

function addProductToCart(cartProduct) {
  const cartItems = getLocalStorage("so-cart") || [];
  cartItems.push(cartProduct);
  setLocalStorage("so-cart", cartItems);
}

// add to cart button event handler
async function addToCartHandler(e) {
  //e.target.dataset.id should contain the ID of the product
  const selectedProduct = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(selectedProduct);
}

// Listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
