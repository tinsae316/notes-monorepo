const http = require("http");

const notes = [
  { id: 1, title: "Learn Turbo" },
  { id: 2, title: "Build Monorepo" }
];

const server = http.createServer((req, res) => {
  if (req.url === "/notes") {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(notes));
  }
});

server.listen(3001, () => {
  console.log("API running on http://localhost:3001");
});
