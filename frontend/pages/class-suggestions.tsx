"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import classData from "../data/raw/classes.json";
import mergedProfessors from "../data/processed/merged_professors.json";

// Normalize once
const normalize = (name: string) =>
  name.toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim();

// ✅ Only include profs with actual RMP data
const rmpProfSet = new Set(
  mergedProfessors
    .filter(
      (p) =>
        p.avgRating !== null ||
        p.avgDifficulty !== null ||
        p.wouldTakeAgainPercent !== null ||
        p.numRatings !== null
    )
    .map((p) => `${normalize(p.lastName)}, ${normalize(p.firstName)}`)
);

export default function SuggestionsWithRMPFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [department, setDepartment] = useState(searchParams?.get("dept") || "");
const [professor, setProfessor] = useState(searchParams?.get("prof") || "");
const [maxDifficulty, setMaxDifficulty] = useState(searchParams?.get("max") || "");
const [onlyWithRMP, setOnlyWithRMP] = useState(searchParams?.get("onlyWithRMP") === "true");


  // 🔁 Update URL on filter change
  useEffect(() => {
    const params = new URLSearchParams();
    if (department) params.set("dept", department);
    if (professor) params.set("prof", professor);
    if (maxDifficulty) params.set("max", maxDifficulty);
    if (onlyWithRMP) params.set("onlyWithRMP", "true");

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [department, professor, maxDifficulty, onlyWithRMP]);

  const filteredClasses = useMemo(() => {
    return classData.filter((cls) => {
      const matchesDepartment =
        department === "" ||
        cls.subject.toLowerCase().includes(department.toLowerCase());

      const matchesProfessor =
        professor === "" ||
        cls.professors.some((p) =>
          p.prof.toLowerCase().includes(professor.toLowerCase())
        );

      const avgDifficulty = cls.professors.length
        ? cls.professors.reduce((sum, p) => sum + p.avggrade, 0) / cls.professors.length
        : 0;

      const matchesDifficulty =
        maxDifficulty === "" || avgDifficulty <= parseFloat(maxDifficulty);

      const hasRMP = cls.professors.some((p) =>
        rmpProfSet.has(normalize(p.prof))
      );

      // 🔁 Only exclude if checkbox is checked
      return (
        matchesDepartment &&
        matchesProfessor &&
        matchesDifficulty &&
        (!onlyWithRMP || hasRMP)
      );
    });
  }, [department, professor, maxDifficulty, onlyWithRMP]);

  return (
    <div
      style={{
        padding: "24px",
        marginTop: "80px",
        maxWidth: "800px",
        marginLeft: "auto",
        marginRight: "auto",
        fontFamily: "'Poppins', sans-serif",
        color: "#ffffffff",
        background: "#1b196bff",
        borderRadius: "20px",
      }}
    >
      <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "24px", textAlign: "center" }}>
        Class Suggestions
      </h1>

      {/* Filters */}
      <div style={{ marginBottom: "30px", display: "flex", flexDirection: "column", gap: "14px" }}>
        <input
          type="text"
          placeholder="Filter by Department (e.g. CS)"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Filter by Professor (e.g. Challen)"
          value={professor}
          onChange={(e) => setProfessor(e.target.value)}
          style={inputStyle}
        />
        <input
          type="number"
          min="1"
          max="5"
          step="0.1"
          placeholder="Max Difficulty, 1 (easy) - 5 (difficult)"
          value={maxDifficulty}
          onChange={(e) => setMaxDifficulty(e.target.value)}
          style={inputStyle}
        />
        <label style={{ fontSize: "16px", fontWeight: "600" }}>
          <input
            type="checkbox"
            checked={onlyWithRMP}
            onChange={() => setOnlyWithRMP((prev) => !prev)}
            style={{ marginRight: "10px", transform: "scale(1.2)" }}
          />
          Only show classes with RMP data
        </label>
      </div>

      {/* Results */}
      {(department.trim() !== "" || professor.trim() !== "") && (
        <>
          {filteredClasses.length === 0 ? (
            <p style={{ fontSize: "18px", fontWeight: "500", color: "#fbbf24" }}>
              No classes match your filters.
            </p>
          ) : (
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {filteredClasses.map((cls, i) => {
                const slug = cls.code.toLowerCase().replace(/\s+/g, "");
                const avgGpa =
                  cls.professors.length > 0
                    ? (
                        cls.professors.reduce((sum, p) => sum + p.avggrade, 0) /
                        cls.professors.length
                      ).toFixed(2)
                    : "N/A";

                return (
                  <li
                    key={i}
                    style={{
                      marginBottom: "24px",
                      padding: "16px",
                      borderRadius: "10px",
                      backgroundColor: "rgba(255 255 255 / 0.15)",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.06)",
                    }}
                  >
                    <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "6px" }}>
                      <Link
                        href={`/classes/${slug}`}
                        style={{ color: "#db8e22ff", textDecoration: "none" }}
                      >
                        {cls.code} — {cls.name}
                      </Link>
                    </h2>
                    <p style={{ marginBottom: "4px" }}>
                      Department: <strong>{cls.subject}</strong>
                    </p>
                    <p style={{ marginBottom: "8px" }}>
                      Avg GPA: <strong>{avgGpa}</strong>
                    </p>
                    <p style={{ fontWeight: "600", marginBottom: "6px" }}>Professors:</p>
                    <ul style={{ paddingLeft: "16px", marginTop: 0 }}>
                      {cls.professors.map((p, j) => (
                        <li key={j} style={{ marginBottom: "4px" }}>
                          {p.prof} — GPA: {p.avggrade.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: "6px",
  border: "none",
  fontSize: "16px",
  fontWeight: "500",
  outline: "none",
  boxShadow: "0 0 6px rgba(255, 255, 255, 0.2)",
  backgroundColor: "rgba(255 255 255 / 0.15)",
  color: "#fafafa",
};
