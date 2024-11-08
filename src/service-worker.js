import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { setCacheNameDetails, clientsClaim } from "workbox-core";
import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { googleFontsCache, imageCache } from "workbox-recipes";
import { BackgroundSyncPlugin } from "workbox-background-sync";

// SETTINGS

// Claiming control to start runtime caching asap
clientsClaim();

// Use to update the app after user triggered refresh
//self.skipWaiting();

// Setting custom cache names
setCacheNameDetails({ precache: "wb7-precache", runtime: "wb7-runtime" });

// PRECACHING

// Precache and serve resources from __WB_MANIFEST array
precacheAndRoute(self.__WB_MANIFEST);

// NAVIGATION ROUTING

// This assumes /index.html has been precached.
const navHandler = createHandlerBoundToURL("/index.html");
const navigationRoute = new NavigationRoute(navHandler);
registerRoute(navigationRoute);

// STATIC RESOURCES

googleFontsCache({ cachePrefix: "wb7-gfonts" });

// CONTENT

imageCache({ cacheName: "wb7-content-images", maxEntries: 10 });

// RUNTIME CACHING

// Keeping wasm always fresh
registerRoute(({ url }) => url.pathname.endsWith(".wasm"), new NetworkFirst());

// APP SHELL UPDATE FLOW

addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
