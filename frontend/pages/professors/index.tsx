import { useState, useMemo } from "react";
import Link from "next/link";
import classesData from "../../data/raw/classes.json";

type Professor = {
  prof: string;
  avggrade: number;
};

type Class = {
  subject: string;
  code: string;
  name: string;
  professors: Professor[];
};

export default function Professors() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Get unique subjects for dropdown
  const subjects = useMemo(() => {
    const uniqueSubjects = new Set(classesData.map((c: Class) => c.subject));
    return Array.from(uniqueSubjects).sort();
  }, []);

  // Filter classes by selected subject - now memoized
  const filteredClasses = useMemo(() => {
    if (!selectedSubject) return [];
    return classesData.filter((c: Class) => c.subject === selectedSubject);
  }, [selectedSubject]);

  // Calculate department average GPA for selected subject
  const departmentAverage = useMemo(() => {
    if (!selectedSubject) return null;

    const allGrades = filteredClasses.flatMap((c) =>
      c.professors.map((p) => p.avggrade)
    );

    if (allGrades.length === 0) return null;

    const sum = allGrades.reduce((a, b) => a + b, 0);
    return sum / allGrades.length;
  }, [filteredClasses, selectedSubject]);

  // Collect all professors in the subject, flatten & remove duplicates by prof name
  const allProfessors = useMemo(() => {
    if (!selectedSubject) return [];

    const profMap = new Map<string, Professor>();

    filteredClasses.forEach((c) => {
      c.professors.forEach((p) => {
        if (!profMap.has(p.prof)) {
          profMap.set(p.prof, p);
        }
      });
    });

    return Array.from(profMap.values());
  }, [filteredClasses, selectedSubject]);

  // Filter professors by search term (case insensitive)
  const filteredProfessors = useMemo(() => {
    if (!searchTerm) return allProfessors;

    return allProfessors.filter((prof) =>
      prof.prof.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allProfessors, searchTerm]);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Professors</h1>

      {/* Subject Dropdown */}
      <label htmlFor="subject-select" className="block mb-2 font-semibold">
        Select Subject:
      </label>
      <select
        id="subject-select"
        className="mb-4 p-2 border rounded w-full max-w-xs"
        value={selectedSubject}
        onChange={(e) => {
          setSelectedSubject(e.target.value);
          setSearchTerm(""); // reset search on subject change
        }}
      >
        <option value="">-- Choose a subject --</option>
        {subjects.map((subject) => (
          <option key={subject} value={subject}>
            {subject}
          </option>
        ))}
      </select>

      {/* Search bar */}
      {selectedSubject && (
        <>
          <label htmlFor="prof-search" className="block mb-2 font-semibold">
            Search Professors:
          </label>
          <input
            id="prof-search"
            type="text"
            className="mb-6 p-2 border rounded w-full max-w-xs"
            placeholder="Type a professor's name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </>
      )}

      {/* Department average */}
      {selectedSubject && (
        <p className="mb-6 text-lg">
          Department average GPA for <strong>{selectedSubject}</strong>:{" "}
          {departmentAverage ? departmentAverage.toFixed(2) : "N/A"}
        </p>
      )}

      {/* Professors list */}
      {selectedSubject && (
        <ul className="space-y-3">
          {filteredProfessors.length === 0 && (
            <p>No professors found matching your search.</p>
          )}
          {filteredProfessors.map((prof) => (
            <li
              key={prof.prof}
              className="border p-4 rounded hover:shadow-md transition"
            >
              <Link
                href={`/professors/${encodeURIComponent(prof.prof)}`}
                className="text-blue-600 hover:underline"
              >
                {prof.prof}
              </Link>{" "}
              - Avg Grade: {prof.avggrade.toFixed(2)}{" "}
              {departmentAverage &&
                `(${(prof.avggrade - departmentAverage).toFixed(2)} from dept avg)`}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
