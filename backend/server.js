const http = require("node:http");
const hostName = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(
    `<html><body style="text-align:center;">
    <h1 style="color:green;">Home Page</h1>
    <p>A computer science portal</p>
    </body></html>`
  );
  res.end();
});

server.listen(port, hostName, () => {
  console.log(`Server running at http://${hostName}:${port}/`);
});
