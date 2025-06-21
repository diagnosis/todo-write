import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import TanStackRouterWebpack from "@tanstack/router-plugin/webpack";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
      tailwindcss(),
  ],
  server: {
    port: 3000,
    open: true,
  },
})