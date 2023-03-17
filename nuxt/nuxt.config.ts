import { transpile } from "typescript";
import nitroConfigHook from "./nuxt-config/hooks/nitro";
import viteConfig from "./nuxt-config/vite";

export default defineNuxtConfig({
  ssr: false,
  debug: true,

  hooks: {
    ...nitroConfigHook,
  },

  alias: {
    "@walletconnect/web3-provider":
      "@walletconnect/web3-provider/dist/cjs/index.js",
  },

  modules: ["@pinia/nuxt", "@vueuse/nuxt", "@nuxtjs/tailwindcss"],

  typescript: {
    typeCheck: false,
  },

  vite: viteConfig,

  plugins: [{ src: "./nuxt-config/buffer.ts", ssr: false }],
});
