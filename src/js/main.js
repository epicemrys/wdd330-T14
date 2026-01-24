import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

const dataSource = new ProductData('tents'); //instance of ProductData
const element = document.querySelector('product-list');
const productList = new ProductList('tents', dataSource, element);

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