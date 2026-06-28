import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const host = process.env.HOST || "127.0.0.1";
const port = Number.parseInt(process.env.PORT || "8000", 10);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8"
};

function getFilePath(url = "/") {
  const { pathname } = new URL(url, `http://${host}:${port}`);
  const requestedPath = pathname === "/" ? "/index.html" : decodeURIComponent(pathname);
  const normalizedPath = normalize(requestedPath).replace(/^([/\\])+/, "");
  return resolve(join(rootDir, normalizedPath));
}

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, { "content-type": "text/plain; charset=utf-8" });
  response.end(message);
}

const server = createServer((request, response) => {
  const filePath = getFilePath(request.url);
  if (!filePath.startsWith(rootDir)) {
    sendText(response, 403, "Forbidden");
    return;
  }

  let fileStats;
  try {
    fileStats = statSync(filePath);
  } catch {
    sendText(response, 404, "Not found");
    return;
  }

  if (!fileStats.isFile()) {
    sendText(response, 404, "Not found");
    return;
  }

  const contentType = contentTypes[extname(filePath)] || "application/octet-stream";
  response.writeHead(200, { "content-type": contentType });
  createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`OrigamiStory is running at http://${host}:${port}`);
});
