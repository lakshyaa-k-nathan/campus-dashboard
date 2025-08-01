"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import classData from "../data/raw/classes.json";
import mergedProfessors from "../data/processed/merged_professors.json";

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

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const handleCheckboxChange = () => {
    setOnlyWithRMP((prev) => !prev);
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
        ? cls.professors.reduce((sum, p) => sum + p.avggrade, 0) /
          cls.professors.length
        : 0;

      const matchesDifficulty =
        maxDifficulty === "" || avgDifficulty <= parseFloat(maxDifficulty);

      const hasRMP = cls.professors.some((p) => rmpProfSet.has(normalize(p.prof)));

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
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "'Poppins', sans-serif",
        color: "#f0f0f5",
        background:
          "linear-gradient(135deg, #4c1d95, #7c3aed, #a78bfa, #c4b5fd)",
        borderRadius: "12px",
        boxShadow:
          "0 10px 15px -3px rgba(124, 58, 237, 0.5), 0 4px 6px -4px rgba(124, 58, 237, 0.4)",
      }}
    >
      <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "24px" }}>
        Class Suggestions
      </h1>

      {/* Filters */}
      <div
        style={{
          marginBottom: "30px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <input
          type="text"
          placeholder="Filter by Department (e.g. CS)"
          value={department}
          onChange={handleInputChange(setDepartment)}
          style={{
            padding: "10px 14px",
            borderRadius: "6px",
            border: "none",
            fontSize: "16px",
            fontWeight: "500",
            outline: "none",
            boxShadow: "0 0 6px rgba(255, 255, 255, 0.2)",
            backgroundColor: "rgba(255 255 255 / 0.15)",
            color: "#fafafa",
          }}
        />
        <input
          type="text"
          placeholder="Filter by Professor (e.g. Challen)"
          value={professor}
          onChange={handleInputChange(setProfessor)}
          style={{
            padding: "10px 14px",
            borderRadius: "6px",
            border: "none",
            fontSize: "16px",
            fontWeight: "500",
            outline: "none",
            boxShadow: "0 0 6px rgba(255, 255, 255, 0.2)",
            backgroundColor: "rgba(255 255 255 / 0.15)",
            color: "#fafafa",
          }}
        />
        <input
          type="number"
          min="1"
          max="5"
          step="0.1"
          placeholder="Max Difficulty, 1 (easy) - 5 (difficult)"
          value={maxDifficulty}
          onChange={handleInputChange(setMaxDifficulty)}
          style={{
            padding: "10px 14px",
            borderRadius: "6px",
            border: "none",
            fontSize: "16px",
            fontWeight: "500",
            outline: "none",
            boxShadow: "0 0 6px rgba(255, 255, 255, 0.2)",
            backgroundColor: "rgba(255 255 255 / 0.15)",
            color: "#fafafa",
          }}
        />
        <label style={{ fontSize: "16px", fontWeight: "600" }}>
          <input
            type="checkbox"
            checked={onlyWithRMP}
            onChange={handleCheckboxChange}
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
                      boxShadow:
                        "0 4px 6px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.06)",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        marginBottom: "6px",
                      }}
                    >
                      <Link
                        href={`/classes/${slug}`}
                        style={{ color: "#d8b4fe", textDecoration: "none" }}
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
                    <p style={{ fontWeight: "600", marginBottom: "6px" }}>
                      Professors:
                    </p>
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
