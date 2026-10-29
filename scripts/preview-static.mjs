import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { resolve, sep, extname } from "node:path";

// Local preview only. Deploy out/ to a static host for production.
const root = resolve("out");
const port = Number(process.env.PORT || 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
};

await stat(resolve(root, "index.html")).catch(() => {
  throw new Error("Static export missing. Run npm run build first.");
});

createServer(async (req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }
  try {
    const url = new URL(req.url, "http://localhost");
    let file = resolve(root, `.${decodeURIComponent(url.pathname)}`);
    if (!file.startsWith(root + sep) && file !== root) {
      res.writeHead(403).end();
      return;
    }
    let status = 200;
    let info = await stat(file).catch(() => null);
    if (info?.isDirectory()) {
      if (!url.pathname.endsWith("/")) {
        res.writeHead(308, { Location: `${url.pathname}/${url.search}` }).end();
        return;
      }
      file = resolve(file, "index.html");
      info = await stat(file).catch(() => null);
    }
    if (!info?.isFile()) {
      status = 404;
      file = resolve(root, "404.html");
    }
    res.writeHead(status, {
      "Content-Type": types[extname(file)] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    if (req.method === "HEAD") res.end();
    else createReadStream(file).on("error", () => res.destroy()).pipe(res);
  } catch {
    res.writeHead(400).end("Bad request");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Static preview: http://localhost:${port}`);
});
