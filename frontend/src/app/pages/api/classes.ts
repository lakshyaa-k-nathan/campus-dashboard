// pages/api/classes.ts
/** 
import type { NextApiRequest, NextApiResponse } from "next";
import classes from "../../../../../data/raw/classes.json";



export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = (req.query.q as string || "").toLowerCase();

  if (!query) {
    res.status(200).json([]); // empty query = empty list
    return;
  }

  const filtered = classes.filter((cls) =>
    cls.name.toLowerCase().includes(query)
  );

  const result = filtered.map((cls) => {
    const avgRating =
      cls.professors.reduce((sum, p) => sum + p.reviews, 0) / cls.professors.length;

    return {
      id: cls.id,
      code: cls.code,
      name: cls.name,
      department: cls.department,
      averageGrade: cls.averageGrade,
      difficulty: cls.difficulty,
      averageProfessorRating: Number(avgRating.toFixed(2)),
    };
  });

  res.status(200).json(result);
}

*/
import type { NextApiRequest, NextApiResponse } from 'next';
import classes from "../../../../../data/raw/classes.json";


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = (req.query.q as string || '').toLowerCase();
  if (!query) {
    res.status(200).json([]);
    return;
  }

  const filtered = classes.filter(cls =>
    cls.name.toLowerCase().includes(query)
  );

  res.status(200).json(filtered);
}
