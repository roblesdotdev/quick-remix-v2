import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequestHandler } from "@remix-run/express";
import { broadcastDevReady } from "@remix-run/node";
import { ip as ipAddress } from "address";
import chalk from "chalk";
import closeWithGrace from "close-with-grace";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
const MODE = process.env.NODE_ENV;
const BUILD_PATH = "../build/index.js";
const WATCH_PATH = "../build/version.txt";
const build = await import(BUILD_PATH);
let devBuild = build;
const app = express();
const getHost = (req) => req.get("X-Forwarded-Host") ?? req.get("host") ?? "";
app.use((req, res, next) => {
  const proto = req.get("X-Forwarded-Proto");
  const host = getHost(req);
  if (proto === "http") {
    res.set("X-Forwarded-Proto", "https");
    res.redirect(`https://${host}${req.originalUrl}`);
    return;
  }
  next();
});
app.use((req, res, next) => {
  if (req.path.endsWith("/") && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    const safepath = req.path.slice(0, -1).replace(/\/+/g, "/");
    res.redirect(301, safepath + query);
  } else {
    next();
  }
});
app.use(compression());
app.disable("x-powered-by");
app.use(
  "/build",
  express.static("public/build", { immutable: true, maxAge: "1y" })
);
app.use(
  "/fonts",
  express.static("public/fonts", { immutable: true, maxAge: "1y" })
);
app.use(express.static("public", { maxAge: "1h" }));
morgan.token("url", (req) => decodeURIComponent(req.url ?? ""));
app.use(morgan("tiny"));
const maxMultiple = process.env.TESTING ? 1e4 : 1;
const rateLimitDefault = {
  windowMs: 60 * 1e3,
  max: 1e3 * maxMultiple,
  standardHeaders: true,
  legacyHeaders: false
};
const strongestRateLimit = rateLimit({
  ...rateLimitDefault,
  max: 10 * maxMultiple
});
const strongRateLimit = rateLimit({
  ...rateLimitDefault,
  max: 100 * maxMultiple
});
const generalRateLimit = rateLimit(rateLimitDefault);
app.use((req, res, next) => {
  const strongPaths = ["/signup", "/login"];
  if (req.method !== "GET" && req.method !== "HEAD") {
    if (strongPaths.some((p) => req.path.includes(p))) {
      return strongestRateLimit(req, res, next);
    }
    return strongRateLimit(req, res, next);
  }
  return generalRateLimit(req, res, next);
});
app.all(
  "*",
  process.env.NODE_ENV === "development" ? (...args) => createRequestHandler({ build: devBuild, mode: MODE })(...args) : createRequestHandler({ build, mode: MODE })
);
const portToUse = Number(process.env.PORT || 3e3);
const server = app.listen(portToUse, () => {
  const localUrl = `http://localhost:${portToUse}`;
  let lanUrl = null;
  const localIp = ipAddress() ?? "Unknown";
  if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(localIp)) {
    lanUrl = `http://${localIp}:${portToUse}`;
  }
  console.log(
    `
${chalk.bold("Local:")}            ${chalk.cyan(localUrl)}
${lanUrl ? `${chalk.bold("On Your Network:")}  ${chalk.cyan(lanUrl)}` : ""}
${chalk.bold("Press Ctrl+C to stop")}
		`.trim()
  );
  if (process.env.NODE_ENV === "development") {
    broadcastDevReady(build);
  }
});
closeWithGrace(async () => {
  await new Promise((resolve, reject) => {
    server.close((e) => e ? reject(e) : resolve("ok"));
  });
});
if (process.env.NODE_ENV === "development") {
  async function reloadBuild() {
    devBuild = await import(`${BUILD_PATH}?update=${Date.now()}`);
    broadcastDevReady(devBuild);
  }
  const chokidar = await import("chokidar");
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const watchPath = path.join(dirname, WATCH_PATH).replace(/\\/g, "/");
  const buildWatcher = chokidar.watch(watchPath, { ignoreInitial: true }).on("add", reloadBuild).on("change", reloadBuild);
  closeWithGrace(async () => {
    await buildWatcher.close();
  });
}
//# sourceMappingURL=index.js.map
