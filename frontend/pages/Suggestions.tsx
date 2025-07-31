"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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

// Normalize once
const normalize = (name: string) =>
  name.toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim();

const rmpProfSet = new Set(
  mergedProfessors.map(
    (p) => `${normalize(p.lastName)}, ${normalize(p.firstName)}`
  )
);

export default function SuggestionsWithRMPFilter() {
  const [department, setDepartment] = useState("");
  const [professor, setProfessor] = useState("");
  const [maxDifficulty, setMaxDifficulty] = useState("");
  const [onlyWithRMP, setOnlyWithRMP] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Trigger search on first user input
  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setHasSearched(true);
  };

  const handleCheckboxChange = () => {
    setOnlyWithRMP((prev) => !prev);
    setHasSearched(true);
  };

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

      return (
        matchesDepartment &&
        matchesProfessor &&
        matchesDifficulty &&
        (!onlyWithRMP || hasRMP)
      );
    });
  }, [department, professor, maxDifficulty, onlyWithRMP]);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Class Suggestions</h1>

      {/* Filters */}
      <div style={{ margin: "20px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          placeholder="Filter by Department (e.g. CS)"
          value={department}
          onChange={handleInputChange(setDepartment)}
        />
        <input
          type="text"
          placeholder="Filter by Professor (e.g. Challen)"
          value={professor}
          onChange={handleInputChange(setProfessor)}
        />
        <input
          type="number"
          placeholder="Max Difficulty, 1 (easy) - 5 (difficult)"
          value={maxDifficulty}
          onChange={handleInputChange(setMaxDifficulty)}
        />
        <label>
          <input
            type="checkbox"
            checked={onlyWithRMP}
            onChange={handleCheckboxChange}
          />{" "}
          Only show classes with RMP data
        </label>
      </div>

      {/* Results */}
{(department.trim() !== "" || professor.trim() !== "") && (
  <>
    {filteredClasses.length === 0 ? (
      <p>No classes match your filters.</p>
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
                marginBottom: "20px",
                borderBottom: "1px solid #ccc",
                paddingBottom: "10px",
              }}
            >
              <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                <Link href={`/classes/${slug}`}>
                  {cls.code} — {cls.name}
                </Link>
              </h2>
              <p>Department: {cls.subject}</p>
              <p>Avg GPA: {avgGpa}</p>
              <p>Professors:</p>
              <ul>
                {cls.professors.map((p, j) => (
                  <li key={j}>
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
