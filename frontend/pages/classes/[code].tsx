import { useRouter } from "next/router";
import classes from "../../data/raw/classes.json";

export default function ClassPage() {
  const router = useRouter();
  const { code } = router.query;
  const formattedCode = (code as string)?.toLowerCase().replace(/\s+/g, '');

  const classData = classes.find(cls =>
    cls.code.toLowerCase().replace(/\s+/g, '') === formattedCode
  );

  if (!code) return <p>Loading...</p>;
  if (!classData) return <p>Class not found</p>;

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Page for: {classData.code}</h1>

      <p>Compare professors for {classData.name}.</p>
      <p>Department: {classData.subject}</p>

      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-2">Professors & Avg GPA</h3>
        <ul className="list-disc list-inside">
          {classData.professors?.map((prof, index) => (
            <li key={index}>
              {prof.prof} — GPA: {prof.avggrade?.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
