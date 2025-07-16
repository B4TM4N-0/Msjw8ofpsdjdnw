export default function handler(req, res) {
  const fs = require('fs');
  const path = require('path');

  const filename = req.query.file + '.lua';
  const filePath = path.join(process.cwd(), 'public', filename);

  if (!fs.existsSync(filePath)) {
    res.status(404).send('File Not Found');
    return;
  }

  const rawURL = `https://${req.headers.host}/raw/${filename}`;
  const display = `--<<Subscribe To M4rkk3:)>>
loadstring(game:HttpGet("${rawURL}"))()`;

  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${filename}</title>
      <style>
        body { background:#141414;color:white;font-family:monospace;padding:40px }
        .card {
          background:#303030;
          border:1px solid #505050;
          border-radius:6px;
          padding:10px;
          max-width:480px;
          margin:auto;
          overflow:auto;
        }
        pre {
          white-space: pre-wrap;
          word-break: break-word;
        }
      </style>
    </head>
    <body>
      <div style="max-width:480px;margin:auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span>Author: Markk</span>
          <button onclick="copy()">📋</button>
        </div>
        <div class="card"><pre id="code">${escapeHtml(display)}</pre></div>
      </div>
      <script>
        function copy() {
          navigator.clipboard.writeText(document.getElementById("code").innerText);
        }
      </script>
    </body>
    </html>
  `);
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;");
}
