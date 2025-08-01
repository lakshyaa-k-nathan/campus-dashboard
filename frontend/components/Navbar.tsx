// frontend/components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-4 right-6 bg-white shadow-lg rounded-lg px-6 py-3 flex gap-4 z-50">
      <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold">
        Home
      </Link>
      <Link href="/class-suggestions" className="text-blue-600 hover:text-blue-800 font-semibold">
        Class Suggestions
      </Link>
      <Link href="/professors" className="text-blue-600 hover:text-blue-800 font-semibold">
  Professor Profiles
</Link>
    </nav>
  );
}
