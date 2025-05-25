import type { NextApiRequest, NextApiResponse } from 'next';
import classes from '../../data/raw/classes.json';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = (req.query.q as string || '').toLowerCase();

  if (!query) {
    res.status(200).json([]);
    return;
  }

  const filtered = classes
    .filter(cls => cls.name.toLowerCase().includes(query) || cls.code.toLowerCase().includes(query.replace(/\s+/g, '')))
    .sort((a, b) => a.name.localeCompare(b.name)); 

  res.status(200).json(filtered);
}


