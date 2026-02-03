import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

export default class CheckoutProcess {
  constructor(cartItems) {
    this.cartItems = cartItems;
    this.subtotal = 0;
    this.tax = 0;
    this.shipping = 0;
    this.orderTotal = 0;
  }

  init() {
    this.calculateTotals();
    this.displayTotals();
  }

  calculateTotals() {
    // Subtotal: sum of (final price × quantity) for each item
    this.subtotal = this.cartItems.reduce((acc, item) => {
      const qty = item.quantity || 1;
      return acc + parseFloat(item.FinalPrice || item.finalPrice || 0) * qty;
    }, 0);

    // Tax: 6% (as shown in your checkout HTML)
    this.tax = this.subtotal * 0.06;

    // Shipping: simple rule based on ZIP (re-evaluated every time)
    const zipInput = document.getElementById("zip");
    const zip = zipInput ? zipInput.value.trim() : "";
    this.shipping = (zip && zip.startsWith("8")) ? 8 : 12; // example: lower for Idaho zips

    // Final total
    this.orderTotal = this.subtotal + this.tax + this.shipping;
  }

  displayTotals() {
    this.calculateTotals(); // recalculate with current ZIP value

    // Update DOM elements (these IDs must exist in checkout/index.html)
    const subtotalEl = document.getElementById("subtotal");
    const taxEl     = document.getElementById("tax");
    const shippingEl = document.getElementById("shipping");
    const totalEl   = document.getElementById("order-total");

    if (subtotalEl) subtotalEl.textContent = `$${this.subtotal.toFixed(2)}`;
    if (taxEl)      taxEl.textContent     = `$${this.tax.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `$${this.shipping.toFixed(2)}`;
    if (totalEl)    totalEl.textContent   = `$${this.orderTotal.toFixed(2)}`;
  }

  // Format items exactly as the server expects
  prepareOrderItems() {
    return this.cartItems.map(item => ({
      id: item.Id || item.id || "UNKNOWN",
      name: item.Name || item.name || "Unnamed Product",
      price: parseFloat(item.FinalPrice || item.finalPrice || 0),
      quantity: item.quantity || 1
    }));
  }

  // Main checkout function – called from checkout.js on form submit
  async checkout(formElement) {
    try {
      // 1. Collect form data
      const formData = new FormData(formElement);
      const jsonData = this.formDataToJSON(formData);

      // 2. Build payload matching server requirements
      const payload = {
        orderDate: new Date().toISOString(),
        fname: jsonData.fname || "",
        lname: jsonData.lname || "",
        street: jsonData.street || "",
        city: jsonData.city || "",
        state: jsonData.state || "",
        zip: jsonData.zip || "",
        cardNumber: jsonData["card-number"] || "",
        expiration: jsonData["expiration-date"] || "",
        code: jsonData["security-code"] || "",
        items: this.prepareOrderItems(),
        orderTotal: this.orderTotal.toFixed(2),
        shipping: this.shipping,
        tax: this.tax.toFixed(2)
      };

      // 3. Send to server
      const externalServices = new ExternalServices();
      const response = await externalServices.submitOrder(payload);

      console.log("Order submitted successfully:", response);

      // 4. Clear cart on success
      setLocalStorage("so-cart", []);
      dispatchCartChange();

      // 5. User feedback
      alert("Order placed successfully! Thank you for your purchase.");

      // 6. Redirect after short delay
      setTimeout(() => {
        window.location.href = "/index.html";
      }, 1500);

      return response;
    } catch (error) {
      console.error("Checkout process failed:", error);
      alert("There was a problem processing your order. Please try again.");
      throw error; // let checkout.js handle button state
    }
  }

  // Helper: Convert FormData to plain object
  formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const obj = {};
    formData.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }
}