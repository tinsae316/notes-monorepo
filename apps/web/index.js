const http = require("http");

const server = http.createServer(async (req, res) => {

  if (req.url === "/") {
    const data = await fetch("http://localhost:3001/notes");
    const notes = await data.json();

    res.setHeader("Content-Type", "text/html");

    res.end(`
<!DOCTYPE html>
<html>
<head>
  <title>Notes App</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f5f7fb;
      display: flex;
      justify-content: center;
      padding: 40px;
    }

    .container {
      width: 400px;
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    h1 {
      text-align: center;
    }

    form {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    }

    input {
      flex: 1;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #ddd;
    }

    button {
      padding: 10px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    .add-btn { background: #4CAF50; color: white; }
    .refresh-btn { background: #2196F3; color: white; width: 100%; }
    .delete-btn { background: #e74c3c; color: white; }

    ul { list-style: none; padding: 0; }

    li {
      background: #f1f3f7;
      margin-top: 10px;
      padding: 10px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>

<body>
  <div class="container">
    <h1>Notes</h1>

    <form method="POST" action="/add">
      <input name="title" placeholder="Write a note..." required />
      <button class="add-btn">Add</button>
    </form>

    <form method="GET" action="/">
      <button class="refresh-btn">Refresh</button>
    </form>

    <ul>
      ${notes.map(n => `
        <li>
          ${n.title}
          <form method="POST" action="/delete?id=${n.id}">
            <button class="delete-btn">X</button>
          </form>
        </li>
      `).join("")}
    </ul>
  </div>
</body>
</html>
    `);
    return;
  }

  // ADD
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

  // DELETE
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