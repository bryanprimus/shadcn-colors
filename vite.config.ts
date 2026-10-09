import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // The gallery intentionally renders nearly every shadcn component on one
    // page, so the vendor chunk (React, Base UI, icons, color engine) is large.
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      output: {
        // Split heavy, rarely changing dependencies so app updates stay small.
        codeSplitting: {
          groups: [
            { name: "charts", test: /node_modules[\\/](recharts|d3-|victory-vendor|es-toolkit|decimal\.js)/ },
            { name: "vendor", test: /node_modules/ },
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
    },
  },
})
