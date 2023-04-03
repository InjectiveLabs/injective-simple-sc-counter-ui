import nitroConfigHook from "./nuxt-config/hooks/nitro";
import viteConfig from "./nuxt-config/vite";

export default defineNuxtConfig({
  ssr: false,

  hooks: {
    ...nitroConfigHook,
  },

  modules: ["@pinia/nuxt", "@vueuse/nuxt", "@nuxtjs/tailwindcss"],

  typescript: {
    typeCheck: "build",
  },

  sourcemap: {
    server: false,
    client: true,
  },

  imports: {
    dirs: ["store/**"],
  },

  pinia: {
    autoImports: ["defineStore"],
  },

  vite: viteConfig,

  plugins: [{ src: "./nuxt-config/buffer.ts", ssr: false }],
});
