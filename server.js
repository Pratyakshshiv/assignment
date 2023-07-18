const http = require("http");
const fs = require("fs");
const path = require("path");
const Events = require("./event");

const port = 3000;

const events = new Events();

events.initializeMongoDB();

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    const filePath = path.join(__dirname, "index.html");
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error loading index.html");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  } else if (req.method === "POST" && req.url === "/log") {
    events.trigger("click");
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Event logged on the server.");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Page not found.");
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
