import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";

function productDetailsTemplate(product) {
  const imgSrc = product.Image?.startsWith("/") ? product.Image : `/${product.Image}`;
  return `
    <section class="product-detail">
      <h3 class="product-card__brand">${product.Brand?.Name ?? ""}</h3>
      <h2 class="product-card__name">${product.NameWithoutBrand ?? product.Name ?? ""}</h2>
      <img class="divider" src="${imgSrc}" alt="${product.NameWithoutBrand ?? product.Name ?? ""}" />
      <p class="product-card__price">$${product.FinalPrice ?? ""}</p>
      <p class="product__color">${product.Colors?.[0]?.ColorName ?? ""}</p>
      <p class="product__description">${product.DescriptionHtmlSimple ?? ""}</p>
      <button id="addToCart" class="add-to-cart">Add to Cart</button>
    </section>
  `;
}

export default class ProductDetails {
  constructor(dataSource, productId) {
    this.dataSource = dataSource;
    this.productId = productId;
    this.product = null;
  }

  async init() {
    console.log("🧩 ProductDetails.init() ejecutado con productId:", this.productId);

    this.product = await this.dataSource.findProductById(this.productId);
    console.log("✅ Producto obtenido:", this.product);

    const container = document.querySelector(".product-detail");
    if (!container) {
      console.error("❌ No se encontró el contenedor '.product-detail' en el HTML.");
      return;
    }

    container.innerHTML = productDetailsTemplate(this.product);

    const addBtn = document.querySelector("#addToCart");
    if (!addBtn) {
      console.error("❌ No se encontró el botón #addToCart.");
      return;
    }

    addBtn.addEventListener("click", () => {
      console.log("🛒 Botón clickeado");
      this.addToCart();
    });

    updateCartCount();
  }

  addToCart() {
    console.log("📦 addToCart() ejecutado");
    if (!this.product) {
      console.error("❌ Producto no cargado, no se puede agregar al carrito.");
      return;
    }

    const cart = getLocalStorage("so-cart") || [];
    console.log("🧾 Carrito actual:", cart);

    cart.push(this.product);
    setLocalStorage("so-cart", cart);
    console.log("✅ Producto agregado al localStorage:", this.product);

    updateCartCount();
  }
}
