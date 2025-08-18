const path = require("path")
const fs = require("node:fs")

const CWD = process.cwd()
const resourcesPath = path.join(CWD, "resources")
const stylesPath = path.join(resourcesPath, "styles")

const baseStylePaths = [
  path.join(stylesPath, "theme.css"),
  path.join(stylesPath, "base.css"),
  path.join(stylesPath, "simple.css"),
].filter(Boolean)

const getViewStyles = (view) => {
  const customStylePath = path.join(CWD, "project", `${view}.css`)
  return fs.existsSync(customStylePath) ? customStylePath : undefined
}

const eofolWebpackPluginOptions = {
  html: {
    template: ["index.html", "nested1/index.html"],
    header: {
      title: "Eofol6",
      description: "All inclusive web framework with zero configuration, batteries included!",
      keywords: "Web framework",
      imageSrc: "./assets/media/images/logo.png",
      imageType: "image/png",
      imageAlt: "Eofol6 logo",
      url: "https://eofol.com/eofol6/",
      theme: "#000000",
    },
  },
  css: {
    shared: baseStylePaths,
    views: {
      index: getViewStyles("index"),
      "nested1/index": getViewStyles("nested1/index"),
    },
  },
  font: [
    {
      path: "resources/Roboto-Regular.woff2",
      fontFamily: "Roboto",
      fontFamilyFallback: "sans-serif",
      format: "woff2",
      inline: false,
      fontStyle: "normal",
      fontWeight: 400,
      fontDisplay: "swap",
      primary: true,
    },
  ],
  js: {
    views: { index: "assets/js/main.js", "nested1/index": "assets/js/main.js" },
    inline: true,
    babelify: true,
  },
  inject: {
    manifest: true,
    robots: true,
    sw: true,
    errorOverlay: true,
    sitemap: true,
    add: {},
    remove: [],
  },
  manifest: { shortName: "eofol6", name: "Eofol6", startUrl: ".", display: "standalone", bgColor: "#111111" },
  theme: "#8b008b",
  icon: "media/logo.png",
  resourceHints: {
    preload: [
      { url: "assets/media/images/logo-lg.png", as: "image" },
      { url: "assets/media/images/logo-sm.png", as: "image", fetchPriority: "high" },
    ],
    prefetch: ["nested1/index.html"],
    preconnect: ["https://eofol.com"],
  },
  compression: {
    gzip: true,
    brotli: true,
  },
  createPages: {
    created: {
      template:
        '<div class="col container"><h1>Created page</h1><img src="./assets/media/images/logo-lg.png" alt="Eofol logo" height="256" width="256" fetchpriority="high"><div>Created page content</div></div>',
      head: {
        title: "Created page",
        description: "All inclusive web framework with zero configuration, batteries included!",
        keywords: "Web framework",
        imageSrc: "./assets/media/images/logo.png",
        imageType: "image/png",
        imageAlt: "Eofol6 logo",
        url: "https://eofol.com/eofol6/",
        theme: "#000000",
      },
      css: baseStylePaths.reduce(
        (acc, next) => `${acc} ${fs.readFileSync(next)}`,
        '@font-face{font-family:Roboto;font-style:normal;font-weight:400;font-display:swap;src:url(./assets/media/fonts/Roboto-Regular.woff2) format("woff2")}body{font-family:Roboto,sans-serif;font-size:1rem}',
      ),
    },
  },
}

module.exports = eofolWebpackPluginOptions
