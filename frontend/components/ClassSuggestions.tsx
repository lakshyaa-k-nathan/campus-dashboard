// components/SuggestionsWithRMPFilter.tsx
import React, { useState } from "react";
import Link from "next/link";

// Example props types (adjust as needed)
type Professor = {
  lastName: string;
  firstName: string;
  normalizedName: string;
  // other prof fields...
};

type ClassType = {
  code: string;
  name: string;
  professors: Professor[];
  // other class fields...
};

type SuggestionsProps = {
  classes: ClassType[];
  rmpProfessorsSet: Set<string>; // Set of normalized professor names with RMP data
};

export default function SuggestionsWithRMPFilter({ classes, rmpProfessorsSet }: SuggestionsProps) {
  const [showOnlyRMP, setShowOnlyRMP] = useState(false);

  // Helper to check if class has at least one RMP professor
  function hasRMPProfessor(cls: ClassType) {
    return cls.professors.some(prof => rmpProfessorsSet.has(prof.normalizedName));
  }

  // Filter classes based on toggle
  const filteredClasses = showOnlyRMP
    ? classes.filter(hasRMPProfessor)
    : classes;

  return (
    <div>
      <label className="inline-flex items-center mb-4">
        <input
          type="checkbox"
          checked={showOnlyRMP}
          onChange={() => setShowOnlyRMP(!showOnlyRMP)}
          className="mr-2"
        />
        Show only classes with at least one RMP professor
      </label>

      <ul>
        {filteredClasses.map((cls, index) => (
          <li key={index} className="mb-2">
            <Link href={`/class/${encodeURIComponent(cls.code)}`}>
              <a className="text-blue-600 hover:underline font-semibold">
                {cls.code}
              </a>
            </Link>
            {" — "}{cls.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
