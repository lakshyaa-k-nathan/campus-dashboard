"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import classes from "../../data/raw/classes.json";
import mergedProfessors from "../../data/processed/merged_professors.json";

export default function ClassPage() {
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    if (typeof router.query.code === "string") {
      setCode(router.query.code);
    }
  }, [router.query.code]);

  if (!code) return <p>Loading...</p>;

  const formatted = code.toLowerCase().replace(/\s+/g, "");
  const classInfo = classes.find(c => c.code.toLowerCase().replace(/\s+/g, "") === formatted);
  if (!classInfo) return <p>Class not found</p>;

  const profs = mergedProfessors.filter(p =>
    p.courses?.some(course => course.code.toLowerCase().replace(/\s+/g, "") === formatted)
  );

  return (
    <main style={{padding:20}}>
      <h1>{classInfo.code} — {classInfo.name}</h1>
      <p>Department: {classInfo.subject}</p>
      <h2>Professors & Stats</h2>
      <ul>
        {profs.map((p, i) => {
          const info = p.courses?.find(c => c.code.toLowerCase().replace(/\s+/g, "") === formatted);
          return (
            <li key={i} style={{marginBottom:12}}>
              <strong>{p.lastName}, {p.firstName}</strong><br/>
              GPA: {info?.avggrade?.toFixed(2) ?? "N/A"} | Rating: {p.avgRating?.toFixed(2) ?? "N/A"} | Difficulty: {p.avgDifficulty?.toFixed(2) ?? "N/A"} | Would Take Again: {p.wouldTakeAgainPercent ?? "N/A"}%
            </li>
          );
        })}
      </ul>
    </main>
  );
}
