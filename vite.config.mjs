import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";
import path from "node:path";

const isGitHubPages = true;
const folderName = `${path.basename(process.cwd())}/`;
const mode = process.env.NODE_ENV === "production" ? "production" : "development";
const base = mode === "production" && isGitHubPages ? `/${folderName}` : "/";

export default defineConfig({
  root: "public", // Carpeta raíz configurada en public
  base,
  mode,
  envDir: "../",
  publicDir: "public", // Usa public para archivos estáticos
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Alias para src
    },
  },
  build: {
    outDir: "../dist",
    assetsDir: "./",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "public/index.html"),
        login: path.resolve(__dirname, "public/login.html"),
        register: path.resolve(__dirname, "public/register.html"), // Agregado
      },
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
    historyApiFallback: true, // Redirige todas las rutas al index.html (SPA)
    proxy: {
      "/api": "http://localhost:3000", // Proxy para el servidor backend Express
    },
  },
});
