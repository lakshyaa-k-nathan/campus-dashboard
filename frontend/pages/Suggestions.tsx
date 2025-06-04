"use client";
import { useState } from "react";
import classData from "../data/raw/classes.json";

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

export default function Suggestions() {
  const [department, setDepartment] = useState("");
  const [professor, setProfessor] = useState("");
  const [maxDifficulty, setMaxDifficulty] = useState("");

  // Helper to calculate average difficulty
  const getAvgDifficulty = (professors: Professor[]) => {
    if (!professors.length) return 0;
    const total = professors.reduce((sum, p) => sum + p.avggrade, 0);
    return total / professors.length;
  };

  // Filtered list
  const filtered = classData.filter((cls) => {
    const matchesDepartment = department === "" || cls.subject.toLowerCase().includes(department.toLowerCase());
    const matchesProfessor =
      professor === "" ||
      cls.professors.some((p) => p.prof.toLowerCase().includes(professor.toLowerCase()));
    const avgDifficulty = getAvgDifficulty(cls.professors);
    const matchesDifficulty = maxDifficulty === "" || avgDifficulty <= parseFloat(maxDifficulty);

    return matchesDepartment && matchesProfessor && matchesDifficulty;
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Class Suggestions</h1>

      <div className="space-y-2 mb-6">
        <input
          type="text"
          placeholder="Filter by Department (e.g. VM)"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Filter by Professor (e.g. Aldridge)"
          value={professor}
          onChange={(e) => setProfessor(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          placeholder="Max Difficulty (e.g. 3.5)"
          value={maxDifficulty}
          onChange={(e) => setMaxDifficulty(e.target.value)}
          className="border p-2 rounded w-full"
          min="0"
          step="0.01"
        />
      </div>

      {filtered.length === 0 ? (
        <p>No classes match your filters.</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((cls, index) => (
            <li key={index} className="border-b pb-2">
              <h2 className="text-lg font-semibold">{cls.code} — {cls.name}</h2>
              <p>Department: {cls.subject}</p>
              <p>Avg Difficulty: {getAvgDifficulty(cls.professors).toFixed(2)}</p>
              <p>Professors:</p>
              <ul className="list-disc ml-5">
                {cls.professors.map((prof, i) => (
                  <li key={i}>{prof.prof} — GPA: {prof.avggrade.toFixed(2)}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
