import { promises as fs } from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;

  // Ensure `name` is a single string
  if (!name || Array.isArray(name)) {
    res.status(400).json({ error: 'Invalid or missing image name. Expected a single string.' });
    return;
  }

  const filePath = path.join('/tmp', name); // Now `name` is guaranteed to be a string

  try {
    const file = await fs.readFile(filePath);
    res.setHeader('Content-Type', 'image/jpeg'); // Set appropriate content type
    res.send(file);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(404).json({ error: 'Image not found' });
  }
}