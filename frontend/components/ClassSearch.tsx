"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

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

  // Sort classes alphabetically by name before rendering
  const sortedClasses = [...classes].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div
      className="min-h-screen p-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white font-poppins"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <input
        type="text"
        placeholder="Search classes by name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 mb-6 rounded-md bg-indigo-700 placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition duration-300"
      />

      {loading && <p className="text-pink-300 font-semibold">Loading...</p>}
      {error && <p className="text-red-400 font-semibold">{error}</p>}

      {!loading && sortedClasses.length === 0 && query.trim() !== "" && (
        <p className="text-indigo-300">No classes found.</p>
      )}

      <ul>
        {sortedClasses.map((cls) => (
          <li key={cls.id} className="mb-6 border-b border-indigo-600 pb-3">
            <h3 className="text-xl font-semibold hover:text-pink-400 transition duration-300">
              <Link href={`/classes/${cls.code}`}>
                {cls.code} - {cls.name}
              </Link>
            </h3>
          </li>
        ))}
      </ul>
    </div>
  );
}
