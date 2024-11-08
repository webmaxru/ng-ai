const { injectManifest } = require("workbox-build");

let workboxConfig = {
  globDirectory: "dist/prog-web-news",
  globPatterns: [
    "index.html",
    "*.css",
    "*.js",
    "icons/**/*",
    "samples/**/*",
    "wasm/**/*",
  ],
  globIgnores: [
    // Skip ES5 bundles for Angular
    "**/*-es5.*.js",
  ],

  swSrc: "src/service-worker.js",
  swDest: "dist/ng-ai/sw.js",

  // Angular takes care of cache busting for JS and CSS (in prod mode)
  dontCacheBustURLsMatching: new RegExp(".+.[a-f0-9]{20}.(?:js|css)"),

  // By default, Workbox will not cache files larger than 2Mb (might be an issue for dev builds)
  maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4Mb
};

injectManifest(workboxConfig).then(({ count, size }) => {
  console.log(
    `Generated ${workboxConfig.swDest}, which will precache ${count} files, totaling ${size} bytes.`
  );
});
