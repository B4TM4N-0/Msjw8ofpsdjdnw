const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// 👇 Serve /public as raw files
app.use('/raw', express.static(path.join(__dirname, 'public')));

app.get('/:filename.lua', (req, res) => {
  const fileName = req.params.filename + '.lua';

  // You can optionally check if file exists:
  const filePath = path.join(__dirname, 'public', fileName);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send('<h1 style="color:white;background:black;padding:20px;">404 - File Not Found</h1>');
      return;
    }

    const rawURL = `https://${req.headers.host}/raw/${fileName}`;

    const luaWrapper = `--<<Subscribe To M4rkk3:)>>
loadstring(game:HttpGet("${rawURL}"))()`;

    res.setHeader('Content-Type', 'text/html');

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${fileName}</title>
        <style>
          * { box-sizing: border-box; }

          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            background-color: rgb(20, 20, 20);
            font-family: monospace;
            color: white;
          }

          body {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
          }

          .container {
            width: 100%;
            max-width: 480px;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }

          .author {
            font-size: 15px;
            text-align: left;
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
            opacity: 1;
            border: none;
            background: none;
            cursor: pointer;
            transition: transform 0.2s, filter 0.2s;
          }

          .copy-btn.clicked {
            transform: scale(1.2);
            filter: drop-shadow(0 0 6px rgb(0, 162, 255));
          }

          .copy-btn img {
            width: 18px;
            height: 18px;
            filter: brightness(1000%) invert(1);
          }

          .card {
            background-color: rgb(48, 48, 48);
            border: 1px solid rgb(80, 80, 80);
            border-radius: 6px;
            padding: 10px;
            width: 100%;
            height: 300px;
            overflow-y: auto;
            position: relative;
          }

          pre {
            margin: 0;
            padding: 0;
            font-size: 13px;
            line-height: 1.4;
            text-align: left;
            white-space: pre-wrap;
            word-break: break-word;
            color: white;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="author">Author: Markk</div>
            <button class="copy-btn" onclick="copyToClipboard(this)">
              <img src="https://cdn-icons-png.flaticon.com/512/60/60990.png" alt="Copy" />
            </button>
          </div>

          <div class="card">
            <pre id="code">${escapeHtml(luaWrapper)}</pre>
          </div>
        </div>

        <script>
          function copyToClipboard(button) {
            const text = document.getElementById("code").innerText;
            button.classList.add("clicked");

            setTimeout(() => {
              button.classList.remove("clicked");
            }, 200);

            navigator.clipboard.writeText(text).catch(() => {});
          }
        </script>
      </body>
      </html>
    `);
  });
});

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Server running');
});