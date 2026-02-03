import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

// Load header and footer
loadHeaderFooter().then(async () => {
  await initCartBadge();
});

// Initialize product list when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    const dataSource = new ExternalServices("tents"); //instance of ExternalServices
    const element = document.querySelector("product-list");
    const productList = new ProductList("tents", dataSource, element);

  productList.init();
});

//Fetch data and log to console
async function fetchExternalServices() {
    try {
        const data = await ExternalServices.getData();
        console.log(data);
    } catch (error) {
        console.error("Error fetching product data:", error);
    }
}

fetchExternalServices();
