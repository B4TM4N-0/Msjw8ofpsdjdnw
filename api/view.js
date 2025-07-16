const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  const { file } = req.query;
  const filePath = path.join(process.cwd(), 'public', `${file}.lua`);

  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      res.status(404).send('<h1 style="color:white;background:black;padding:20px;">404 - File Not Found</h1>');
      return;
    }

    const rawURL = `https://${req.headers.host}/raw/${file}.lua`;
    const luaWrapper = `--<<Subscribe To M4rkk3:)>>\n\nloadstring(game:HttpGet("${rawURL}"))()`;

    res.setHeader('Content-Type', 'text/html');

    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${file}.lua</title>
        <style>
          body {
            margin: 0;
            font-family: monospace;
            background: rgb(20, 20, 20);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .container {
            max-width: 480px;
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .author {
            font-size: 15px;
            position: relative;
            overflow: hidden;
          }
          .author::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(120deg, transparent, rgba(255,255,255,0.3), transparent);
            animation: shine 2.5s infinite;
          }
          @keyframes shine {
            0% { left: -100%; }
            50% { left: 100%; }
            100% { left: 100%; }
          }
          .copy-btn {
            background: none;
            border: none;
            cursor: pointer;
            opacity: 1;
            transition: transform 0.2s;
          }
          .copy-btn.clicked {
            transform: scale(1.2);
          }
          .copy-btn img {
            width: 18px;
            height: 18px;
            filter: brightness(1000%) invert(1);
          }
          .card {
            background: rgb(48, 48, 48);
            border: 1px solid rgb(80, 80, 80);
            padding: 10px;
            border-radius: 6px;
            height: 300px;
            overflow-y: auto;
          }
          pre {
            margin: 0;
            font-size: 13px;
            line-height: 1.4;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="author">Author: Markk</div>
            <button class="copy-btn" onclick="copyToClipboard(this)">
              <img src="https://cdn-icons-png.flaticon.com/512/60/60990.png" />
            </button>
          </div>
          <div class="card">
            <pre id="code">${luaWrapper}</pre>
          </div>
        </div>
        <script>
          function copyToClipboard(btn) {
            const text = document.getElementById("code").innerText;
            btn.classList.add("clicked");
            setTimeout(() => btn.classList.remove("clicked"), 200);
            navigator.clipboard.writeText(text).catch(() => {});
          }
        </script>
      </body>
      </html>
    `);
  });
}
