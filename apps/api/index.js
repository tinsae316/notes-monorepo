const http = require("http");

let notes = [
  { id: 1, title: "Learn Turbo" },
  { id: 2, title: "Build Monorepo" }
];

const server = http.createServer((req, res) => {
  // GET notes
  if (req.method === "GET" && req.url === "/notes") {
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify(notes));
  }

  // ADD note
  if (req.method === "POST" && req.url === "/notes") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      const newNote = JSON.parse(body);

      const note = {
        id: Date.now(),
        title: newNote.title
      };

      notes.push(note);

      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(note));
    });

    return;
  }

  // DELETE note
  if (req.method === "DELETE" && req.url.startsWith("/notes/")) {
    const id = parseInt(req.url.split("/")[2]);

    notes = notes.filter(n => n.id !== id);

    res.end("Deleted");
    return;
  }
});

server.listen(3001, () => {
  console.log("API running on http://localhost:3001");
});
