"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import classesData from "../../data/raw/classes.json";
import mergedProfessors from "../../data/processed/merged_professors.json";

// Normalize a string: lowercase, remove periods, normalize spaces, trim
const normalize = (name: string) =>
  name.toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim();

export default function ProfessorProfile() {
  const router = useRouter();
  const { slug } = router.query;

  const [professorSlug, setProfessorSlug] = useState<string | null>(null);

  useEffect(() => {
    if (typeof slug === "string") {
      setProfessorSlug(slug);
    }
  }, [slug]);

  if (!professorSlug) {
    return <p>Loading...</p>;
  }

  // Find classes taught by professor and accumulate grades
  let totalGrades = 0;
  let gradeCount = 0;
  const classList: { code: string; name: string; avggrade: number }[] = [];

  for (const cls of classesData) {
    const prof = cls.professors.find((p) => p.prof === professorSlug);
    if (prof && typeof prof.avggrade === "number") {
      totalGrades += prof.avggrade;
      gradeCount++;
      classList.push({
        code: cls.code,
        name: cls.name,
        avggrade: prof.avggrade,
      });
    }
  }

  const avgGrade = gradeCount > 0 ? totalGrades / gradeCount : null;

  // Parse the slug to extract last and first names
  const [lastName, firstRaw = ""] = professorSlug.split(",");
  const normalizedLast = normalize(lastName);
  const normalizedFirst = normalize(firstRaw.split(" ")[0] || "");

  // Find matching RateMyProfessors data
  const rmpProf = mergedProfessors.find((p) => {
    const match =
      normalize(p.lastName) === normalizedLast &&
      normalize(p.firstName).startsWith(normalizedFirst);
    if (match) {
      console.log(`✅ RMP match found for: ${professorSlug}`);
    }
    return match;
  });

  // Debug logs (remove in production)
  console.log("🔍 Slug from URL:", professorSlug);
  console.log("🔍 Normalized Last Name:", normalizedLast);
  console.log("🔍 Normalized First Name (partial):", normalizedFirst);
  if (!rmpProf) {
    console.warn("⚠️ No RMP match found for:", professorSlug);
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{professorSlug}</h1>

      <p className="mb-2">
        <strong>Average GPA Across Classes:</strong>{" "}
        {avgGrade !== null ? avgGrade.toFixed(2) : "N/A"}
      </p>

      {rmpProf ? (
        <section className="mb-4">
          <h2 className="text-2xl font-semibold">RateMyProfessors Data</h2>
          <p>Rating: {rmpProf.avgRating?.toFixed(2) ?? "N/A"} / 5</p>
          <p>Difficulty: {rmpProf.avgDifficulty?.toFixed(2) ?? "N/A"} / 5</p>
          <p>Would Take Again: {rmpProf.wouldTakeAgainPercent ?? "N/A"}%</p>
          <p>Number of Ratings: {rmpProf.numRatings ?? "N/A"}</p>
        </section>
      ) : (
        <p>No RateMyProfessors data available.</p>
      )}

      <h2 className="text-2xl font-semibold mb-2">Classes Taught</h2>
      <ul className="list-disc list-inside">
        {classList.length > 0 ? (
          classList.map(({ code, name, avggrade }) => (
            <li key={code}>
              {code}: {name} — GPA: {avggrade?.toFixed(2) ?? "N/A"}
            </li>
          ))
        ) : (
          <li>No classes found for this professor.</li>
        )}
      </ul>
    </main>
  );
}
