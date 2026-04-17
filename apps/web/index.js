const http = require("http");

const server = http.createServer(async (req, res) => {
  if (req.url === "/") {
    const data = await fetch("http://localhost:3001/notes");
    const notes = await data.json();

    res.setHeader("Content-Type", "text/html");

    res.end(`
      <h1>Notes</h1>
      <ul>
        ${notes.map(n => `<li>${n.title}</li>`).join("")}
      </ul>
    `);
  }
});

server.listen(3000, () => {
  console.log("Web running on http://localhost:3000");
});
