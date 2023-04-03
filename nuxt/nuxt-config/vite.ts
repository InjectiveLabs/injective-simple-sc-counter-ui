import { UserConfig, defineConfig } from "vite";
import { nodePolyfills } from "@bangjelkoski/vite-plugin-node-polyfills";

export default defineConfig({
  define: {
    "process.env": JSON.stringify({}),
    "process.env.DEBUG": JSON.stringify(process.env.DEBUG),
  },

  plugins: [nodePolyfills({ protocolImports: false })],

  build: {
    sourcemap: false,

    rollupOptions: {
      cache: false,
      output: {
        manualChunks: (id: string) => {
          //
        },
      },
    },
  },

  optimizeDeps: {
    exclude: ["fsevents"],
  },
}) as UserConfig;
