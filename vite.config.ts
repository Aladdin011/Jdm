import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import dns from "node:dns";

// Ensure Vite uses verbatim DNS resolution to avoid host/IP mismatch
dns.setDefaultResultOrder("verbatim");

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === "production") {
    process.env.NODE_ENV = "production";
  }
  return {
    base: "./",
    build: {
      minify: "esbuild",
      target: "es2018",
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            "ui-vendor": [
              "@radix-ui/react-dialog",
              "@radix-ui/react-dropdown-menu",
              "@radix-ui/react-select",
              "@radix-ui/react-tabs",
            ],
            "motion-vendor": ["framer-motion"],
            "supabase-vendor": ["@supabase/supabase-js"],
            "utils": [
              "date-fns",
              "clsx",
              "tailwind-merge",
              "class-variance-authority",
            ],
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },
    esbuild: {
      drop: mode === "production" ? ["console", "debugger"] : [],
    },
    server: {
      // Bind explicitly to localhost to match browser origin
      host: "localhost",
      port: 5177,
      // Allow Vite to pick the next available port when 5177 is in use
      strictPort: false,
      // Explicit HMR websocket configuration to avoid connection failures
      hmr: {
        protocol: "ws",
        host: "localhost",
        // Do not hardcode ports; Vite will use the active server port
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
