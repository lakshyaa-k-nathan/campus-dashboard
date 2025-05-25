"use client";

import React, { useState, useEffect } from "react";

interface Class {
  id: number;
  code: string;
  name: string;
  department: string;
  averageGrade: string;
  difficulty: number;
  averageProfessorRating: number;
}

export default function ProfSearch() {
  const [query, setQuery] = useState("");
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  

  useEffect(() => {
    if (query.trim() === "") {
      setClasses([]);
      return;
    }

    setLoading(true);
    setError("");

    fetch(`/api/classes?q=${encodeURIComponent(query)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: Class[]) => {
        setClasses(data);
      })
      .catch(() => {
        setError("Failed to fetch classes.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search classes by name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && classes.length === 0 && query.trim() !== "" && (
        <p>No classes found.</p>
      )}

      <ul>
        {classes.map((cls) => (
          <li key={cls.id} className="mb-4 border-b pb-2">
            <h3 className="font-bold text-lg">
              {cls.code} - {cls.name}
            </h3>
            <p>Department: {cls.department}</p>
            <p>Average Grade: {cls.averageGrade}</p>
            <p>Difficulty: {cls.difficulty}/5</p>
            <p>Average Professor Rating: {cls.averageProfessorRating}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
