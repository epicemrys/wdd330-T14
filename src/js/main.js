import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

const productData = new ProductData('tents'); //instance of ProductData
const listElement = document.getElementById('product-list');
const productList = new ProductList('tents', productData, listElement);

productList.init();

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