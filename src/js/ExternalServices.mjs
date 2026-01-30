export default class ExternalServices {
  constructor() {
    this.baseURL = "http://server-nodejs.cit.byui.edu:3000";
  }

  async checkout(order) {
    const response = await fetch(`${this.baseURL}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    return this.convertToJson(response);
  }

  async convertToJson(res) {
    const jsonResponse = await res.json();

    if (res.ok) {
      return jsonResponse;
    } else {
      throw { name: "servicesError", message: jsonResponse };
    }
  }
}
