import json
import os

# Auto-detect paths relative to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
COURSES_FILE = os.path.join(BASE_DIR, "classes.json")
RATINGS_FILE = os.path.join(BASE_DIR, "professors.json")
OUTPUT_FILE = os.path.join(BASE_DIR, "merged_professors.json")

def load_json(path):
    print(f"🔍 Loading: {os.path.abspath(path)}")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(data, path):
    print(f"💾 Saving to: {os.path.abspath(path)}")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

def names_match(class_name, prof_first, prof_last):
    """
    Match professor names fuzzily:
    - Exact last name match
    - First name of class entry starts with professor's first name (ignoring middle initials)
    """
    try:
        last, first = [part.strip().lower() for part in class_name.split(",", 1)]
    except ValueError:
        return False

    prof_first = prof_first.lower().strip()
    prof_last = prof_last.lower().strip()

    if last != prof_last:
        return False
    return first.startswith(prof_first)

def main():
    # Load data
    classes_data = load_json(COURSES_FILE)
    ratings_data = load_json(RATINGS_FILE)

    merged = []

    for course in classes_data:
        for prof_entry in course.get("professors", []):
            class_prof_name = prof_entry["prof"]

            # Try to find matching professor in ratings data
            match = None
            for prof in ratings_data:
                if names_match(class_prof_name, prof.get("firstName", ""), prof.get("lastName", "")):
                    match = prof
                    break

            # Prepare merged professor data
            first_name = match.get("firstName") if match else class_prof_name.split(", ")[1] if "," in class_prof_name else ""
            last_name = match.get("lastName") if match else class_prof_name.split(",")[0]

            prof_data = {
                "firstName": first_name,
                "lastName": last_name,
                "avgRating": match.get("avgRating") if match else None,
                "avgDifficulty": match.get("avgDifficulty") if match else None,
                "wouldTakeAgainPercent": match.get("wouldTakeAgainPercent") if match else None,
                "numRatings": match.get("numRatings") if match else None,
                "courses": [{
                    "code": course["code"],
                    "name": course["name"],
                    "avggrade": prof_entry.get("avggrade")
                }]
            }

            # Check if professor already in merged list
            existing = next((p for p in merged if p["firstName"] == prof_data["firstName"] and p["lastName"] == prof_data["lastName"]), None)
            if existing:
                existing["courses"].append(prof_data["courses"][0])
            else:
                merged.append(prof_data)

    print(f"✅ Merged {len(merged)} currently teaching professors with ratings and courses.")

    # Save merged data
    save_json(merged, OUTPUT_FILE)

if __name__ == "__main__":
    main()
