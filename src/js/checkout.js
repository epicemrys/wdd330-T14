import { loadHeaderFooter, getLocalStorage, setLocalStorage } from "./utils.mjs";

// Load header and footer
loadHeaderFooter();

class Checkout {
    constructor() {
        this.cartItems = [];
        this.orderData = {};
    }

    init() {
        this.loadCartItems();
        this.displayOrderSummary();
        this.attachFormHandler();
    }

    loadCartItems() {
        this.cartItems = getLocalStorage("so-cart") || [];
        console.log("Checkout - Cart items loaded:", this.cartItems);
    }

    displayOrderSummary() {
        const cartList = document.querySelector(".cart-list");

        if (!this.cartItems || this.cartItems.length === 0) {
            cartList.innerHTML = "<li><p>Your cart is empty</p></li>";
            return;
        }

        // Create order summary items
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

        // Calculate total
        const subtotal = this.cartItems.reduce((sum, item) => {
            const quantity = item.quantity || 1;
            return sum + (parseFloat(item.FinalPrice) * quantity);
        }, 0).toFixed(2);

        const tax = (subtotal * 0.1).toFixed(2); // 10% tax
        const total = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);

        cartList.innerHTML = itemsHTML + `
      <li class="checkout-summary">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>$${subtotal}</span>
        </div>
        <div class="summary-row">
          <span>Tax (10%):</span>
          <span>$${tax}</span>
        </div>
        <div class="summary-row total">
          <span>Total:</span>
          <span>$${total}</span>
        </div>
      </li>
    `;
    }

    attachFormHandler() {
        const form = document.getElementById("checkout-form");
        if (form) {
            form.addEventListener("submit", (e) => this.handleFormSubmit(e));
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(e.target);
        this.orderData = {
            firstName: formData.get("fname"),
            lastName: formData.get("lname"),
            street: formData.get("street"),
            city: formData.get("city"),
            state: formData.get("state"),
            zip: formData.get("zip"),
            phone: formData.get("phone"),
            email: formData.get("email"),
            items: this.cartItems,
            orderDate: new Date().toISOString()
        };

        console.log("Order placed:", this.orderData);

        // Save order to localStorage
        const orders = getLocalStorage("so-orders") || [];
        orders.push(this.orderData);
        setLocalStorage("so-orders", orders);

        // Clear the cart
        setLocalStorage("so-cart", []);

        // Show success message
        alert("Order placed successfully! Thank you for your purchase.");

        // Redirect to home page after a brief delay
        setTimeout(() => {
            window.location.href = "/index.html";
        }, 1500);
    }
}

// Initialize checkout when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const checkout = new Checkout();
    checkout.init();
});