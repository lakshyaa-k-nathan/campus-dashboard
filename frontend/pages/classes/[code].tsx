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

  if (!code)
    return (
      <p className="text-indigo-300 font-semibold text-center mt-10">Loading...</p>
    );

  const formatted = code.toLowerCase().replace(/\s+/g, "");
  const classInfo = classes.find(
    (c) => c.code.toLowerCase().replace(/\s+/g, "") === formatted
  );
  if (!classInfo)
    return (
      <p className="text-red-400 font-semibold text-center mt-10">
        Class not found
      </p>
    );

  const profs = mergedProfessors.filter((p) =>
    p.courses?.some(
      (course) => course.code.toLowerCase().replace(/\s+/g, "") === formatted
    )
  );

  return (
    <main
      className="min-h-screen p-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white font-poppins max-w-4xl mx-auto"
      style={{ padding: "24px",
    marginTop: "80px", // 👈 prevents overlap with navbar
    maxWidth: "800px",
    marginLeft: "auto",
    marginRight: "auto",
        fontFamily: "'Poppins', sans-serif",
        color: "#ffffffff",
        background:
          "#1b196bff",
        borderRadius: "20px",}}
    >
      <h1 className="text-4xl font-bold mb-2">
        {classInfo.code} — {classInfo.name}
      </h1>
      <p className="text-indigo-300 mb-6 text-lg">
        Department: <span className="font-semibold">{classInfo.subject}</span>
      </p>

      <h2 className="text-2xl font-semibold mb-4 border-b border-indigo-600 pb-2">
        Professors & Stats
      </h2>
      <ul>
        {profs.map((p, i) => {
          const info = p.courses?.find(
            (c) => c.code.toLowerCase().replace(/\s+/g, "") === formatted
          );

          const hasRmpData =
            p.avgRating !== null &&
            p.avgRating !== undefined &&
            p.avgDifficulty !== null &&
            p.avgDifficulty !== undefined &&
            p.wouldTakeAgainPercent !== null &&
            p.wouldTakeAgainPercent !== undefined;

          return (
            <li
              key={i}
              className="mb-6 bg-indigo-800 bg-opacity-30 p-4 rounded-md shadow-md"
            >
              <strong className="text-lg">{p.lastName}, {p.firstName}</strong>
              <p className="mt-1">
                GPA:{" "}
                {info?.avggrade !== null && info?.avggrade !== undefined
                  ? info.avggrade.toFixed(2)
                  : "N/A"}{" "}
                {hasRmpData ? (
                  <>
                    | Rating: {p.avgRating!.toFixed(2)} | Difficulty:{" "}
                    {p.avgDifficulty!.toFixed(2)} | Would Take Again:{" "}
                    {p.wouldTakeAgainPercent}%
                  </>
                ) : (
                  "| No RMP data"
                )}
              </p>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
