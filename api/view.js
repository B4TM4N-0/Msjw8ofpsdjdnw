import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { file } = req.query;
  const fileName = `${file}.lua`;

  const filePath = path.join(process.cwd(), 'public', 'raw', fileName); // 👈 add 'raw' here

  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      res.status(404).send('<h1 style="color:white;background:black;padding:20px;">404 - File Not Found</h1>');
      return;
    }

    const rawURL = `${req.headers.host.startsWith('http') ? '' : 'https://'}${req.headers.host}/raw/${fileName}`;
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
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            background: rgb(20, 20, 20);
            font-family: monospace;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container {
            max-width: 480px;
            width: 100%;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
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
            border: 1px solid rgb(80, 80, 80);
            padding: 10px;
            border-radius: 6px;
            height: 300px;
            overflow-y: auto;
          }
          pre {
            margin: 0;
            font-size: 13px;
            white-space: pre-wrap;
            word-break: break-word;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="author">Author: Markk</div>
          </div>
          <div class="card">
            <pre>${luaWrapper}</pre>
          </div>
        </div>
      </body>
      </html>
    `);
  });
}
