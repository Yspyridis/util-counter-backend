const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const port = 3000;
let count = 0;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // Set CORS headers to allow requests from the frontend domain
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://util-counter.vercel.app"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle GET request to the root ("/") route
  else if (req.method === 'GET' && parsedUrl.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello');
  }

  // Handle GET request to fetch the current count value
  if (req.method === "GET" && parsedUrl.pathname === "/api/count") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ count }));
  }

  // Handle POST request to update the count value
  else if (req.method === "POST" && parsedUrl.pathname === "/api/count") {
    let requestBody = "";
    req.on("data", (chunk) => {
      requestBody += chunk.toString();
    });

    req.on("end", () => {
      try {
        const { newCount } = JSON.parse(requestBody);
        if (typeof newCount === "number" && newCount >= 0) {
          count = newCount;
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        } else {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error:
                "Invalid count value. Count must be a non-negative number.",
            })
          );
        }
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ error: "Invalid JSON format in the request body." })
        );
      }
    });
  }

  // Serve static files from the "frontend" folder
  else {
    const filePath = path.join(__dirname, "frontend", parsedUrl.pathname);
    const ext = path.extname(filePath);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("404 Not Found");
      } else {
        // Set the appropriate content type based on the file extension
        const contentTypes = {
          ".html": "text/html",
          ".js": "text/javascript",
          ".css": "text/css",
          // Add more content types for other file types as needed
        };
        res.writeHead(200, {
          "Content-Type": contentTypes[ext] || "text/plain",
        });
        res.end(data);
      }
    });
  }
});

server.listen(port, () => {
  console.log(
    `Server is running on https://chatter-royal-brazil.glitch.me/:${port}`
  );
});
