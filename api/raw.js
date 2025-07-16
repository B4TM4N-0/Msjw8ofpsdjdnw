import { readFile } from 'fs/promises';
import { join } from 'path';

export default async function handler(req, res) {
  const file = req.url.split("/").pop(); // get "TCO.lua"
  const filePath = join(process.cwd(), 'public', file);

  try {
    const content = await readFile(filePath, 'utf8');
    res.setHeader('Content-Type', 'text/plain');
    res.send(content);
  } catch {
    res.status(404).send('File not found');
  }
}