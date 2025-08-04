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
      style={{ paddingTop:"20px",
        padding: "24px",
    marginTop: "0px", // 👈 prevents overlap with navbar
    maxWidth: "800px",
    marginLeft: "auto",
    marginRight: "auto",
        fontFamily: "'Poppins', sans-serif",
        color: "#ffffffff",
        background:
          "#1b196bff",
        borderRadius: "20px",
        }}
    >
      <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "24px" , textAlign: "center"}}>
        Class Search
      </h1>
      <input
      
        type="text"
        placeholder="Search classes by name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 mb-6 rounded-md bg-blue-700 placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
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

      {loading && <p className="text-orange-400 font-semibold">Loading...</p>}
      {error && <p className="text-orange-200 font-semibold">{error}</p>}

      {!loading && sortedClasses.length === 0 && query.trim() !== "" && (
        <p className="text-indigo-300">No classes found.</p>
      )}

      {query.trim() !== "" && (
  <ul>
    {sortedClasses.map((cls) => (
      <li key={cls.id} className="mb-6 border-b border-indigo-600 pb-3">
        <h3 className="text-xl font-semibold hover:text-orange-400 transition duration-300">
          <Link href={`/classes/${cls.code}`}>
            {cls.code} - {cls.name}
          </Link>
        </h3>
      </li>
    ))}
  </ul>
)}
    </div>
  );
}
