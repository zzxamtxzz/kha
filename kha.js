import dotenv from "dotenv";
import { createServer } from "http";
import next from "next";
import { parse } from "url";

dotenv.config();

const port = parseInt(process.env.PORT || "5000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port);

  console.log(
    `> Server listening at http://localhost:${port} as ${dev ? "development" : process.env.NODE_ENV
    }`
  );
});
