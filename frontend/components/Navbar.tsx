import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md px-6 py-3 flex justify-between items-center z-50">
      
      {/* Wrap logo and text inside Link */}
      <Link href="/" className="flex items-center gap-3 font-bold text-lg text-blue-900">
        <img 
          src="https://brand.illinois.edu/wp-content/uploads/2024/02/Color-Variation-Orange-Block-I-White-Background.png" 
          alt="Illinois Logo" 
          className="h-8 w-auto" 
        />
        Campus Dashboard
      </Link>

      {/* Right side - menu */}
      <div className="flex gap-6 text-sm">
        <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold">
          Class Search
        </Link>
        <Link href="/class-suggestions" className="text-blue-600 hover:text-blue-800 font-semibold">
          Class Suggestions
        </Link>
        <Link href="/professors" className="text-blue-600 hover:text-blue-800 font-semibold">
          Professor Profiles
        </Link>
      </div>
    </nav>
  );
}
