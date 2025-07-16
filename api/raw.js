export default function handler(req, res) {
  const fs = require('fs');
  const path = require('path');

  const file = req.query.file;
  const filePath = path.join(process.cwd(), 'public', `${file}.lua`);

  if (!fs.existsSync(filePath)) {
    res.status(404).send('File Not Found');
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  res.setHeader('Content-Type', 'text/plain');
  res.send(content);
}
