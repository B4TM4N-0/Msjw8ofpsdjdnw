export default function handler(req, res) {
  const fs = require('fs');
  const path = require('path');

  const filename = req.query.file + '.lua';
  const filePath = path.join(process.cwd(), 'public', filename);

  if (!fs.existsSync(filePath)) {
    res.status(404).send('<h1 style="color:white;background:black;padding:20px;">404 - File Not Found</h1>');
    return;
  }

  const rawURL = `${req.headers.host.startsWith('http') ? '' : 'https://'}${req.headers.host}/raw/${filename}`;

  const display = `--<<Subscribe To M4rkk3:)>>
loadstring(game:HttpGet("https://${rawURL}"))()`;

  res.setHeader('Content-Type', 'text/html');

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${filename}</title>
      <style>
        body {
          background: rgb(20, 20, 20);
          color: white;
          font-family: monospace;
          margin: 0;
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .header {
          width: 100%;
          max-width: 480px;
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
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
        .card {
          background: rgb(48, 48, 48);
          padding: 10px;
          border: 1px solid rgb(80, 80, 80);
          border-radius: 6px;
          width: 100%;
          max-width: 480px;
          height: 300px;
          overflow-y: auto;
        }
        pre {
          margin: 0;
          font-size: 13px;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="author">Author: Markk</div>
        <button onclick="copyToClipboard()">📋</button>
      </div>
      <div class="card">
        <pre id="code">${escapeHtml(display)}</pre>
      </div>
      <script>
        function copyToClipboard() {
          const text = document.getElementById("code").innerText;
          navigator.clipboard.writeText(text);
        }
      </script>
    </body>
    </html>
  `);
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                                    }
