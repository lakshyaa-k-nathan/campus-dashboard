import { useRouter } from "next/router";

export default function ClassPage() {
  const router = useRouter();
  const { code } = router.query; // CS124

  if (!code) return <p>Loading...</p>;

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Page for: {code}</h1>
      <p>Compare professors for {code}.</p>
      {/* show prof data here w/ disparities*/}
    </main>
  );
}
