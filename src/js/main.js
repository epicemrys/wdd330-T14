
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

const productData = new ProductData("tents");
const listElement = document.getElementById("product-list");
const productList = new ProductList("tents", productData, listElement)

productList.init();