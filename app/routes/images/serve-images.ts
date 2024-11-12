import { promises as fs } from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest,res: NextApiResponse) {
  const { name } = req.query;

  if (!name) {
    res.status(400).json({ error: 'Image name is required' });
    return;
  }

  const filePath = path.join('/tmp', name);

  try {
    const file = await fs.readFile(filePath);
    res.setHeader('Content-Type', 'image/jpeg'); // Or appropriate content type
    res.send(file);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(404).json({ error: 'Image not found' });
  }
}