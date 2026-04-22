const http = require("http");

const server = http.createServer(async (req, res) => {
  if (req.url === "/") {
    const data = await fetch("http://localhost:3001/notes");
    const notes = await data.json();

    res.setHeader("Content-Type", "text/html");

    res.end(`
      <h1>Notes App</h1>

      <form method="POST" action="/add">
        <input name="title" placeholder="New note" required />
        <button>Add</button>
      </form>

      <br/>

      <form method="GET" action="/">
        <button>Refresh</button>
      </form>

      <ul>
        ${notes.map(n => `
          <li>
            ${n.title}
            <form method="POST" action="/delete?id=${n.id}" style="display:inline;">
              <button>Delete</button>
            </form>
          </li>
        `).join("")}
      </ul>
    `);
  }

  // ADD note
  if (req.method === "POST" && req.url === "/add") {
    let body = "";

    req.on("data", chunk => body += chunk);

    req.on("end", async () => {
      const params = new URLSearchParams(body);
      const title = params.get("title");

      await fetch("http://localhost:3001/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });

      res.writeHead(302, { Location: "/" });
      res.end();
    });

    return;
  }

  // DELETE note
  if (req.method === "POST" && req.url.startsWith("/delete")) {
    const url = new URL(req.url, "http://localhost:3000");
    const id = url.searchParams.get("id");

    await fetch(`http://localhost:3001/notes/${id}`, {
      method: "DELETE"
    });

    res.writeHead(302, { Location: "/" });
    res.end();
    return;
  }
});

server.listen(3000, () => {
  console.log("Web running on http://localhost:3000");
});
