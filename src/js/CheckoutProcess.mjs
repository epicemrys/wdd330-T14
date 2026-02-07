import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

export default class CheckoutProcess {
  constructor() {
    this.cartItems = [];
    this.services = new ExternalServices();
  }

  init() {
    this.cartItems = getLocalStorage("so-cart") || [];
    this.displayOrderSummary();
    this.calculateTotals();
  }

  displayOrderSummary() {
    const cartList = document.querySelector(".cart-list");

    if (!this.cartItems || this.cartItems.length === 0) {
      cartList.innerHTML = "<li><p>Your cart is empty</p></li>";
      return;
    }

    const itemsHTML = this.cartItems.map(item => {
      const quantity = item.quantity || 1;
      const total = (parseFloat(item.FinalPrice) * quantity).toFixed(2);
      return `
        <li class="checkout-item divider">
          <div class="item-details">
            <h4>${item.Name}</h4>
            <p>Color: ${item.Colors[0].ColorName}</p>
            <p>Quantity: ${quantity}</p>
            <p>Unit Price: $${item.FinalPrice}</p>
          </div>
          <div class="item-total">
            <p>$${total}</p>
          </div>
        </li>
      `;
    }).join("");

    cartList.innerHTML = itemsHTML;
  }

  calculateTotals() {
    let subtotal = 0;
    let itemCount = 0;

    this.cartItems.forEach(item => {
      const quantity = item.quantity || 1;
      subtotal += parseFloat(item.FinalPrice) * quantity;
      itemCount += quantity;
    });

    const tax = subtotal * 0.06; // 6% tax
    const shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
    const total = subtotal + tax + shipping;

    document.getElementById("cart-subtotal").textContent = "$" + subtotal.toFixed(2);
    document.getElementById("cart-tax").textContent = "$" + tax.toFixed(2);
    document.getElementById("cart-shipping").textContent = "$" + shipping.toFixed(2);
    document.getElementById("cart-total").textContent = "$" + total.toFixed(2);
  }

  prepareItems() {
    return this.cartItems.map(item => ({
      id: item.Id,
      name: item.Name,
      price: parseFloat(item.FinalPrice),
      quantity: item.quantity || 1
    }));
  }

  async checkout(form) {
    const formData = new FormData(form);
    const orderData = {};
    formData.forEach((value, key) => {
      orderData[key] = value;
    });

    const subtotal = parseFloat(document.getElementById("cart-subtotal").textContent.replace("$", ""));
    const tax = parseFloat(document.getElementById("cart-tax").textContent.replace("$", ""));
    const shipping = parseFloat(document.getElementById("cart-shipping").textContent.replace("$", ""));
    const total = parseFloat(document.getElementById("cart-total").textContent.replace("$", ""));

    const payload = {
      orderDate: new Date().toISOString(),
      fname: orderData.fname,
      lname: orderData.lname,
      street: orderData.street,
      city: orderData.city,
      state: orderData.state,
      zip: orderData.zip,
      phone: orderData.phone,
      email: orderData.email,
      cardNumber: orderData.cardNumber,
      expiration: orderData.expiration,
      code: orderData.code,
      items: this.prepareItems(),
      orderTotal: total.toFixed(2),
      shipping: shipping,
      tax: tax.toFixed(2)
    };

    try {
      const response = await this.services.submitOrder(payload);
      alert("Order placed successfully!");
      setLocalStorage("so-cart", []);
      setTimeout(() => {
        window.location.href = "/index.html";
      }, 1500);
    } catch (error) {
      console.error("Order submission failed:", error);
      alert("There was a problem placing your order. Please try again.");
    }
  }
}