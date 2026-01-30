import ExternalServices from "./ExternalServices.mjs";
import { alertMessage } from "./utils.mjs";

export default class CheckoutProcess {
  constructor() {
    this.services = new ExternalServices();
  }

  async checkout() {
    try {
      const order = this.buildOrder();
      await this.services.checkout(order);

      // ✅ Happy path
      localStorage.removeItem("so-cart");
      window.location.href = "./success.html";
    } catch (err) {
      console.error("Checkout error:", err);

      const message =
        err?.name === "servicesError"
          ? err.message?.message ||
            err.message?.error ||
            "Checkout failed. Please check your information."
          : "Something went wrong. Please try again.";

      alertMessage(message, true);
    }
  }

  buildOrder() {
    const form = document.querySelector("#checkoutForm");
    const formData = new FormData(form);

    return {
      fname: formData.get("fname"),
      lname: formData.get("lname"),
      street: formData.get("street"),
      city: formData.get("city"),
      state: formData.get("state"),
      zip: formData.get("zip"),
      cardNumber: formData.get("cardNumber"),
      expiration: formData.get("expiration"),
      code: formData.get("code"),
      items: JSON.parse(localStorage.getItem("so-cart")) || [],
    };
  }
}
