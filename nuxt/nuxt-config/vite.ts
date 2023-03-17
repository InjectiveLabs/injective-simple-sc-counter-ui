import tsconfigPaths from "vite-tsconfig-paths";
import { UserConfig, defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { sleep } from "@injectivelabs/utils";

function getMemoryUsage() {
  return Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100;
}

export default defineConfig({
  define: {
    "process.env": JSON.stringify({}),
  },

  build: {
    sourcemap: false,

    rollupOptions: {
      output: {
        manualChunks: (id: string) => {},
      },
    },
  },

  plugins: [
    tsconfigPaths(),
    nodePolyfills({ protocolImports: true }),
    {
      name: "memory-cap",
      async transform() {
        const MAX_MEMORY_USAGE = 4 * 1024;

        /**
         * When compiling the app, the memory heap can increase a lot and some
         * services like Netlify will fail to finish the build
         */
        if (getMemoryUsage() >= MAX_MEMORY_USAGE) {
          await sleep(10000);
        }
      },
    },
  ],

  optimizeDeps: {
    exclude: ["fsevents"],
  },
}) as UserConfig;
