import { useRouter } from "next/router";
import classes from "../../data/raw/classes.json";

export default function ClassPage() {
  const router = useRouter();
  const { code } = router.query; // extract name from url i think
  const classData = classes.find((cls) => cls.code === code);
  
  if (!code) return <p>Loading...</p>;
  if (!classData) return <p>Class not found</p>;

  const averageProfessorRating =
  classData.professors.reduce((sum, prof) => sum + prof.reviews, 0) / classData.professors.length;


  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Page for: {code}</h1>
    
      <p>Compare professors for {code}.</p>
      <p>Department: {classData.department}</p>
      <p>Average Grade: {classData.averageGrade}</p>
      <p>Difficulty: {classData.difficulty}/5</p>
       <p>Average Professor Rating: {averageProfessorRating}</p>


          <div>
      <h3 className="font-semibold text-lg mb-2">Professors</h3>
      <ul className="list-disc list-inside">
        {classData.professors.map((prof, index) => (
          <li key={index}>
            {prof.name} — {prof.reviews} / 5 /** maybe put a link for each prof? */
          </li>
        ))}
      </ul>
    </div>
    </main>
  );
}
