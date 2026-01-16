// Importa utilidades
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    try {
      // ✅ Obtiene los detalles del producto
      this.product = await this.dataSource.findProductById(this.productId);

      if (!this.product) {
        console.error("❌ No se encontró el producto con ID:", this.productId);
        document.querySelector("main").innerHTML =
          "<p>Producto no encontrado.</p>";
        return;
      }

      // ✅ Renderiza los detalles del producto
      this.renderProductDetails();

      // ✅ Escucha el clic en “Add to Cart”
      const addToCartBtn = document.getElementById("addToCart");
      if (addToCartBtn) {
        addToCartBtn.addEventListener(
          "click",
          this.addProductToCart.bind(this)
        );
      }
    } catch (err) {
      console.error("⚠️ Error al inicializar el producto:", err);
    }
  }

  // ✅ Agrega producto al carrito
  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
    alert(`${this.product.NameWithoutBrand} fue agregado al carrito 🛒`);
  }

  // ✅ Renderiza la información en el HTML
  renderProductDetails() {
    const product = this.product;

    // Títulos
    const brandEl = document.querySelector("#productBrand");
    const nameEl = document.querySelector("#productName");

    brandEl.textContent = product.Brand?.Name || "Unknown Brand";
    nameEl.textContent = product.NameWithoutBrand || "Product";

    // Imagen
    const productImage = document.getElementById("productImage");

    // 🔧 Corrige la ruta de la imagen para funcionar con Vite/public
    const fixedImagePath = product.Image.replace("..", "");
    productImage.src = fixedImagePath.startsWith("/")
      ? fixedImagePath
      : `/${fixedImagePath}`;
    productImage.alt = product.NameWithoutBrand || "Product image";

    // Precio
    const priceEl = document.getElementById("productPrice");
    priceEl.textContent = `$${product.FinalPrice?.toFixed(2) || "N/A"}`;

    // Color
    const colorEl = document.getElementById("productColor");
    colorEl.textContent =
      product.Colors?.[0]?.ColorName || "No color information";

    // Descripción
    const descEl = document.getElementById("productDesc");
    descEl.innerHTML = product.DescriptionHtmlSimple || "No description available";

    // Asigna ID al botón
    const addToCartBtn = document.getElementById("addToCart");
    addToCartBtn.dataset.id = product.Id;
  }
}
