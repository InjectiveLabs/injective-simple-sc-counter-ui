import { NitroConfig } from "nitropack";

const customStaticRoutes: string[] = ["/"];

export default {
  "nitro:config"(nitroConfig: NitroConfig) {
    if (
      nitroConfig.dev ||
      !nitroConfig.prerender ||
      !nitroConfig.prerender.routes
    ) {
      return;
    }

    nitroConfig.prerender.routes = [
      ...nitroConfig.prerender.routes,
      ...customStaticRoutes,
    ];
  },
};
