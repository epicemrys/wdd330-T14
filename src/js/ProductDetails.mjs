import { getLocalStorage, setLocalStorage, updateCartBadge } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

    async init() {
      try {
        const product = await this.dataSource.findProductById(this.productId);

        // if API returns null/undefined
        if (!product) {
          this.renderNotFound();
          return;
        }

        this.product = product;
        this.renderProductDetails();

        const addBtn = document.getElementById("addToCart");
        if (addBtn) {
          addBtn.addEventListener("click", this.addProductToCart.bind(this));
        }
      } catch (err) {
        // any fetch / JSON error
        this.renderNotFound();
      }
    }

  addProductToCart() {
    let cartItems = getLocalStorage("so-cart");
    if (!Array.isArray(cartItems)) {
      cartItems = [];
    }

    const existingItem = cartItems.find(item => item.Id === this.product.Id);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      this.product.quantity = 1;
      cartItems.push(this.product);
    }

    setLocalStorage("so-cart", cartItems);
    updateCartBadge(); // refresh badge immediately
    alert("Item added to cart!");
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }

  renderNotFound() {
    const main = document.querySelector("main");
    if (!main) return;

    main.innerHTML = `
      <section class="product-detail">
        <h2>Product not found</h2>
        <p>We couldn't find the product you requested. Please return to the product list and try again.</p>
        <p><a href="../product_listing/index.html">Back to products</a></p>
      </section>
    `;
  }

}

function productDetailsTemplate(product) {
  document.querySelector("h2").textContent = product.Brand.Name;
  document.querySelector("h3").textContent = product.NameWithoutBrand;

  const productImage = document.getElementById("productImage");
  productImage.src = product.Images.PrimaryLarge;
  productImage.alt = product.NameWithoutBrand;

  document.getElementById("productPrice").textContent = product.FinalPrice;
  document.getElementById("productColor").textContent = product.Colors[0].ColorName;
  document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple;

  document.getElementById("addToCart").dataset.id = product.Id;
}