import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src", // ✅ no necesitas la barra final

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),

        // ✅ Es mejor agrupar los productos así para mantener orden
        "product-pages/cedar-ridge-rimrock-2": resolve(
          __dirname,
          "src/product_pages/cedar-ridge-rimrock-2.html"
        ),
        "product-pages/marmot-ajax-3": resolve(
          __dirname,
          "src/product_pages/marmot-ajax-3.html"
        ),
        "product-pages/northface-alpine-3": resolve(
          __dirname,
          "src/product_pages/northface-alpine-3.html"
        ),
        "product-pages/northface-talus-4": resolve(
          __dirname,
          "src/product_pages/northface-talus-4.html"
        ),
      },
    },
  },
});
