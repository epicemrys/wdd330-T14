import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter } from './utils.mjs';

// Load header and footer
loadHeaderFooter();

// Initialize product list when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const dataSource = new ProductData('tents'); //instance of ProductData
    const element = document.querySelector('product-list');
    const productList = new ProductList('tents', dataSource, element);

    productList.init();
});

//Fetch data and log to console
async function fetchProductData() {
    try {
        const data = await productData.getData();
        console.log(data);
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
}

fetchProductData();