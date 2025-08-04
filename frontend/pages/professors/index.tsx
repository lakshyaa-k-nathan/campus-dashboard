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

  const subjects = useMemo(() => {
    const uniqueSubjects = new Set(classesData.map((c: Class) => c.subject));
    return Array.from(uniqueSubjects).sort();
  }, []);

  const filteredClasses = useMemo(() => {
    if (!selectedSubject) return [];
    return classesData.filter((c: Class) => c.subject === selectedSubject);
  }, [selectedSubject]);

  const departmentAverage = useMemo(() => {
    if (!selectedSubject) return null;

    const allGrades = filteredClasses.flatMap((c) =>
      c.professors.map((p) => p.avggrade)
    );

    if (allGrades.length === 0) return null;

    const sum = allGrades.reduce((a, b) => a + b, 0);
    return sum / allGrades.length;
  }, [filteredClasses, selectedSubject]);

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

  const filteredProfessors = useMemo(() => {
    if (!searchTerm) return allProfessors;

    return allProfessors.filter((prof) =>
      prof.prof.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allProfessors, searchTerm]);

  return (
    <main
      className="p-6 max-w-4xl mx-auto rounded-lg"
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
      <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "24px" , textAlign: "center"}}>
        Professors
      </h1>

      {/* Subject Dropdown */}
      <label
        htmlFor="subject-select"
        className="block mb-2 font-semibold text-purple-200"
      >
        Select Subject:
      </label>
      <select
        id="subject-select"
        className="mb-4 p-2 border rounded w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-white-300 text-orange-400"
        value={selectedSubject}
        onChange={(e) => {
          setSelectedSubject(e.target.value);
          setSearchTerm("");
        }}
      >
        <option value="">Choose a subject --</option>
        {subjects.map((subject) => (
          <option key={subject} value={subject}>
            {subject}
          </option>
        ))}
      </select>

      {/* Search bar */}
      {selectedSubject && (
        <>
          <label
            htmlFor="prof-search"
            className="block mb-2 font-semibold text-purple-200"
          >
            Search Professors:
          </label>
          <input
            id="prof-search"
            type="text"
            className="mb-6 p-2 border rounded w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-white-300 text-orange-400"
            placeholder="Type a professor's name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </>
      )}

      {/* Department average */}
      {selectedSubject && (
        <p className="mb-6 text-lg text-white-100">
          Department average GPA for <strong>{selectedSubject}</strong>:{" "}
          {departmentAverage ? departmentAverage.toFixed(2) : "N/A"}
        </p>
      )}

      {/* Professors list */}
      {selectedSubject && (
        <ul className="space-y-3">
          {filteredProfessors.length === 0 && (
            <p className="text-purple-200">No professors found matching your search.</p>
          )}
          {filteredProfessors.map((prof) => {
            const diff = departmentAverage ? prof.avggrade - departmentAverage : 0;
            const isAbove = diff > 0;
            const isEqual = diff === 0;
            const arrow = isEqual ? "—" : isAbove ? "▲" : "▼";
            const arrowColor = isEqual
              ? "text-gray-400"
              : isAbove
              ? "text-green-400"
              : "text-red-400";

            return (
              <li
                key={prof.prof}
                className="border border-white-300 p-4 rounded hover:shadow-lg transition-shadow bg-white-700/30"
              >
                <Link
                  href={`/professors/${encodeURIComponent(prof.prof)}`}
                  className="text-white-300 hover:underline font-semibold"
                >
                  {prof.prof}
                </Link>{" "}
                - Avg Grade: {prof.avggrade.toFixed(2)}{" "}
                {departmentAverage !== null && (
                  <span className={`ml-2 font-semibold ${arrowColor}`}>
                    {arrow} {Math.abs(diff).toFixed(2)} from dept avg
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
