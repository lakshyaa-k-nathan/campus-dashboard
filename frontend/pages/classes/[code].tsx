import { useRouter } from "next/router";
import classes from "../../data/raw/classes.json";               
import mergedProfessors from "../../data/processed/merged_professors.json";

export default function ClassPage() {
  const router = useRouter();
  const { code } = router.query;

  if (!code || typeof code !== "string") return <p>Loading...</p>;

  const formattedCode = code.toLowerCase().replace(/\s+/g, '');

  const classData = classes.find(cls =>
    cls.code.toLowerCase().replace(/\s+/g, '') === formattedCode
  );

  if (!classData) return <p>Class not found</p>;

  const profsForClass = mergedProfessors.filter(prof =>
    prof.courses?.some(course => course.code.toLowerCase().replace(/\s+/g, '') === formattedCode)
  );

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">{classData.code}</h1>
      <p>Compare professors for {classData.name}.</p>
      <p>Department: {classData.subject}</p>

      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-2">Professors & Stats</h3>
        <ul className="list-disc list-inside">
          {profsForClass.map((prof, index) => {
            const courseInfo = prof.courses?.find(course => course.code.toLowerCase().replace(/\s+/g, '') === formattedCode);

            return (
              <li key={index} className="mb-4">
                <strong>{prof.lastName}, {prof.firstName}</strong>
                <div>Average GPA: {courseInfo?.avggrade?.toFixed(2) ?? "N/A"}</div>
                <div>Student Rating: {prof.avgRating?.toFixed(2) ?? "N/A"}</div>
                <div>Class Difficulty: {prof.avgDifficulty?.toFixed(2) ?? "N/A"}</div>
                <div>
                  Take Again Percentage: {prof.wouldTakeAgainPercent != null && prof.wouldTakeAgainPercent >= 0
                    ? `${prof.wouldTakeAgainPercent.toFixed(1)}%`
                    : "N/A"}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
