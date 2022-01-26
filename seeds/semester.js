/*warning
This deletes Semester
*/
const Semester = require("../model/semester"),
  mongoose = require("mongoose");

//connect mongoose
const mongo = process.env.MONGODB_URI || "mongodb://mongo-db:27017/studyplan";
mongoose
  .connect(mongo, { useNewUrlParser: true })
  .catch((err) => {
    console.log(err.stack);
    process.exit(1);
  })
  .then(() => {
    console.log("connected to db in development environment");
    seedSemester().then(() => {
      mongoose.disconnect();
      console.log("database connection closed after seeding.");
    });
  });

async function seedSemester() {
  await Semester.deleteMany({});

  let semesterData = [];
  let i = 10;
  for (i; i <= 55; i++) {
    semesterData.push({ name: `SoSe${i}` });
    semesterData.push({ name: `WiSe${i}/${i + 1}` });
  }

  let result = await Promise.all(
    semesterData.map(async (sem) => await Semester.create(sem))
  );
  console.log("----");
  console.log("database seeded with:");
  console.log("----");
  console.log("Stage: " + result);
  console.log("----");
  return ".";
}
