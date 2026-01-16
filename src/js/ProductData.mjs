function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    // ✅ Ruta correcta para Vite (sirve desde /public)
    this.path = `/json/${this.category}.json`;
  }

  // Obtener todos los datos del archivo JSON
  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data);
  }

  // Buscar producto por ID
  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
}
