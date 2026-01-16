// ✅ Importamos los módulos necesarios
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { getParam } from "./utils.mjs";

// ✅ Creamos una instancia de la fuente de datos (tents.json)
const dataSource = new ProductData("tents");

// ✅ Obtenemos el parámetro 'product' de la URL
const productId = getParam("product");

// ✅ Creamos los detalles del producto con el orden correcto
const product = new ProductDetails(productId, dataSource);

// ✅ Inicializamos (carga los datos y renderiza en pantalla)
product.init();
