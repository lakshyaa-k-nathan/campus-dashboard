import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md px-6 py-3 flex flex-wrap items-center justify-between z-50">
      
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 font-bold text-lg text-blue-900">
        <img
          src="https://brand.illinois.edu/wp-content/uploads/2024/02/Color-Variation-Orange-Block-I-White-Background.png"
          alt="Illinois Logo"
          className="h-8 w-auto"
        />
        Campus Dashboard
      </Link>

      {/* Hamburger button (shown on small screens) */}
      <button
        className="block md:hidden text-blue-600 hover:text-blue-800 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" /> // X icon when open
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" /> // Hamburger icon when closed
          )}
        </svg>
      </button>

      {/* Menu links */}
      <div className={`w-full md:w-auto md:flex md:items-center gap-6 text-sm mt-3 md:mt-0 ${isOpen ? "block" : "hidden"} md:block`}>
        <Link href="/" className="block md:inline-block text-blue-600 hover:text-blue-800 font-semibold py-1">
          Class Search
        </Link>
        <Link href="/class-suggestions" className="block md:inline-block text-blue-600 hover:text-blue-800 font-semibold py-1">
          Class Suggestions
        </Link>
        <Link href="/professors" className="block md:inline-block text-blue-600 hover:text-blue-800 font-semibold py-1">
          Professor Profiles
        </Link>
      </div>
    </nav>
  );
}
