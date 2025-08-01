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
    return (
      <p
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "18px",
          textAlign: "center",
          marginTop: "40px",
          color: "#ddd6fe",
        }}
      >
        Loading...
      </p>
    );
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

  return (
    <main
      style={{
        maxWidth: "720px",
        margin: "40px auto",
        padding: "24px",
        fontFamily: "'Poppins', sans-serif",
        background:
          "linear-gradient(135deg, #4c1d95, #7c3aed, #a78bfa, #c4b5fd)",
        borderRadius: "14px",
        boxShadow:
          "0 12px 20px -4px rgba(124, 58, 237, 0.6), 0 6px 12px -6px rgba(124, 58, 237, 0.5)",
        color: "#f0f0f5",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "800",
          marginBottom: "16px",
          color: "#ddd6fe",
          textAlign: "center",
          textShadow: "0 0 6px rgba(255,255,255,0.5)",
        }}
      >
        {professorSlug}
      </h1>

      <p
        style={{
          fontSize: "18px",
          fontWeight: "600",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <strong>Average GPA Across Classes: </strong>
        {avgGrade !== null ? avgGrade.toFixed(2) : "N/A"}
      </p>

      {rmpProf ? (
        rmpProf.avgRating == null &&
        rmpProf.avgDifficulty == null &&
        rmpProf.wouldTakeAgainPercent == null &&
        rmpProf.numRatings == null ? (
          <p
            style={{
              fontSize: "16px",
              fontStyle: "italic",
              textAlign: "center",
              marginBottom: "28px",
            }}
          >
            No RateMyProfessors data available.
          </p>
        ) : (
          <section
            style={{
              marginBottom: "32px",
              backgroundColor: "rgba(255 255 255 / 0.12)",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                marginBottom: "14px",
                color: "#e0c3fc",
                textShadow: "0 0 4px rgba(255,255,255,0.3)",
              }}
            >
              RateMyProfessors Data
            </h2>
            <p>Rating: {rmpProf.avgRating?.toFixed(2) ?? "N/A"} / 5</p>
            <p>Difficulty: {rmpProf.avgDifficulty?.toFixed(2) ?? "N/A"} / 5</p>
            <p>
              Would Take Again:{" "}
              {rmpProf.wouldTakeAgainPercent != null
                ? `${rmpProf.wouldTakeAgainPercent}%`
                : "N/A"}
            </p>
            <p>
              Number of Ratings:{" "}
              {rmpProf.numRatings != null ? rmpProf.numRatings : "N/A"}
            </p>
          </section>
        )
      ) : (
        <p
          style={{
            fontSize: "16px",
            fontStyle: "italic",
            textAlign: "center",
            marginBottom: "28px",
          }}
        >
          No RateMyProfessors data available.
        </p>
      )}

      <h2
        style={{
          fontSize: "26px",
          fontWeight: "700",
          marginBottom: "12px",
          borderBottom: "2px solid #a78bfa",
          paddingBottom: "8px",
          color: "#ddd6fe",
        }}
      >
        Classes Taught
      </h2>
      <ul
        style={{
          listStyle: "disc inside",
          fontSize: "18px",
          lineHeight: "1.6",
          paddingLeft: "10px",
          color: "#e0d7ff",
        }}
      >
        {classList.length > 0 ? (
          classList.map(({ code, name, avggrade }) => (
            <li key={code} style={{ marginBottom: "8px" }}>
              <strong>{code}:</strong> {name} — GPA:{" "}
              {avggrade?.toFixed(2) ?? "N/A"}
            </li>
          ))
        ) : (
          <li>No classes found for this professor.</li>
        )}
      </ul>
    </main>
  );
}
