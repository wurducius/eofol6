import "dotenv/config"

const envBoolean = (name, defaultValue) => {
  if (defaultValue) {
    return process.env[name] !== "false"
  } else {
    return process.env[name] === "true"
  }
}

const envString = (name, defaultValue) => process.env[name] ?? defaultValue

const envNumber = (name, defaultValue) => (process.env[name] ? Number(process.env[name]) : defaultValue)

const ConfigCompile = {
  OPEN: envBoolean("OPEN", true),
  PORT: envNumber("PORT", 8080),
  BASE_URL: envString("BASE", "./"),
  VERBOSE_COMPILE: envBoolean("VERBOSE_COMPILE", true),
  LOG_LEVEL_COMPILE: envNumber("LOG_LEVEL_COMPILE", 3),
  PROFILER_COMPILE: envBoolean("PROFILER_COMPILE", true),
  SERVICE_WORKER_INJECT: envBoolean("SERVICE_WORKER_INJECT", true),
  ERROR_OVERLAY_ENABLED: envBoolean("ERROR_OVERLAY_ENABLED", false),
  COMPRESS: envBoolean("COMPRESS", false),
  PROCESS_IMAGES: envBoolean("PROCESS_IMAGES", false),
  MODE: envString("MODE", "development"),
  ANALYZE: envBoolean("ANALYZE", false),
  SOURCE_MAP: envBoolean("SOURCE_MAP", false),
  INLINE_CSS: envBoolean("INLINE_CSS", true),
  MINIFY_HTML: envBoolean("MINIFY_HTML", true),
  MINIFY_CSS: envBoolean("MINIFY_CSS", true),
  MINIFY_JS: envBoolean("MINIFY_JS", true),
  OPTIMIZE_ASSETS: envBoolean("OPTIMIZE_ASSETS", true),
  INJECT_CSS_BASE: envBoolean("INJECT_CSS_BASE", true),
  TEMPLATE_ENABLED: envBoolean("TEMPLATE_ENABLED", true),
  CLEAR_SCREEN: envBoolean("CLEAR_SCREEN", true),
  BUILD_DIRNAME: envString("BUILD_DIRNAME", "dist"),
  PUBLIC_DIRNAME: envString("PUBLIC_DIRNAME", "public"),
  PROJECT_DIRNAME: envString("PROJECT_DIRNAME", "project"),
  ENTRY_FILENAME: envString("ENTRY_FILENAME", "index.html"),
}

export default ConfigCompile
