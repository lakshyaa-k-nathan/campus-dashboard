"use client";

import { useState, useEffect } from "react";
import classData from "../data/raw/classes.json";
import mergedProfessors from "../data/processed/merged_professors.json";

interface Professor {
  prof: string;
  avggrade: number;
}

interface Class {
  subject: string;
  code: string;
  name: string;
  professors: Professor[];
}

// Normalize function now keeps commas, removes dots, normalizes spaces, lowercases
const normalize = (name: string) =>
  name.toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim();

const rmpProfSet = new Set(
  Array.isArray(mergedProfessors)
    ? mergedProfessors.map(
        (p) => `${normalize(p.lastName)}, ${normalize(p.firstName)}`
      )
    : []
);

export default function SuggestionsWithRMPFilter() {
  const [department, setDepartment] = useState("");
  const [professor, setProfessor] = useState("");
  const [maxDifficulty, setMaxDifficulty] = useState("");
  const [onlyWithRMP, setOnlyWithRMP] = useState(false);

  useEffect(() => {
    console.log("📦 Class data loaded:", classData);
    console.log("📦 RMP data loaded:", mergedProfessors);
    console.log("🧠 RMP professor set:", rmpProfSet);
  }, []);

  const getAvgDifficulty = (profs: Professor[]) =>
    profs.length
      ? profs.reduce((sum, p) => sum + p.avggrade, 0) / profs.length
      : 0;

  const filtered = Array.isArray(classData)
    ? classData.filter((cls) => {
        const matchesDepartment =
          department === "" ||
          cls.subject.toLowerCase().includes(department.toLowerCase());

        const matchesProfessor =
          professor === "" ||
          cls.professors.some((p) =>
            p.prof.toLowerCase().includes(professor.toLowerCase())
          );

        const avgDifficulty = getAvgDifficulty(cls.professors);
        const matchesDifficulty =
          maxDifficulty === "" || avgDifficulty <= parseFloat(maxDifficulty);

        // Check if at least one professor has RMP data
        const hasRMP = cls.professors.some((p) => {
          // Normalize full prof name with comma intact
          const normalizedProf = normalize(p.prof);
          const inSet = rmpProfSet.has(normalizedProf);

          // Debug log for each professor
          console.log(
            `🔎 Checking professor "${p.prof}" normalized "${normalizedProf}" in RMP set? ${inSet}`
          );

          return inSet;
        });

        console.log(`📋 Class ${cls.code} - Has at least one RMP professor? ${hasRMP}`);

        return (
          matchesDepartment &&
          matchesProfessor &&
          matchesDifficulty &&
          (!onlyWithRMP || hasRMP)
        );
      })
    : [];

  useEffect(() => {
    console.log("🧪 Filtered classes:", filtered);
  }, [department, professor, maxDifficulty, onlyWithRMP]);

  if (!Array.isArray(classData)) {
    return <div>❌ Error loading class data.</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}
      >
        Class Suggestions
      </h1>

      <p style={{ color: "red", fontWeight: "bold", marginBottom: "10px" }}>
        ✅ Component Rendered — Debug Mode
      </p>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Filter by Department (e.g. CS)"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          style={{ padding: "8px", border: "1px solid gray", borderRadius: "4px" }}
        />
        <input
          type="text"
          placeholder="Filter by Professor (e.g. Challen)"
          value={professor}
          onChange={(e) => setProfessor(e.target.value)}
          style={{ padding: "8px", border: "1px solid gray", borderRadius: "4px" }}
        />
        <input
          type="number"
          placeholder="Max Difficulty (e.g. 3.5)"
          value={maxDifficulty}
          onChange={(e) => setMaxDifficulty(e.target.value)}
          style={{ padding: "8px", border: "1px solid gray", borderRadius: "4px" }}
        />

        {/* Checkbox for RMP filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="checkbox"
            id="rmp-toggle"
            checked={onlyWithRMP}
            onChange={() => setOnlyWithRMP(!onlyWithRMP)}
            style={{ width: "20px", height: "20px" }}
          />
          <label htmlFor="rmp-toggle" style={{ fontWeight: "bold" }}>
            Only show classes with RMP data
          </label>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p>🚫 No classes match your filters.</p>
      ) : (
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {filtered.map((cls, index) => (
            <li
              key={index}
              style={{
                borderBottom: "1px solid #ccc",
                paddingBottom: "10px",
                marginBottom: "10px",
              }}
            >
              <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                {cls.code} — {cls.name}
              </h2>
              <p>Department: {cls.subject}</p>
              <p>Avg GPA: {getAvgDifficulty(cls.professors).toFixed(2)}</p>
              <p>Professors:</p>
              <ul>
                {cls.professors.map((prof, i) => (
                  <li key={i}>
                    {prof.prof} — GPA: {prof.avggrade.toFixed(2)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
