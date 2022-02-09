/*warning
This deletes Stage; This requires Semester
*/
const Stage = require("../model/stage"),
  Semester = require("../model/semester"),
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
    seedStage().then(() => {
      mongoose.disconnect();
      console.log("database connection closed after seeding.");
    });
  });

async function seedStage() {
  await Stage.deleteMany({});

  const sem = await Semester.findOne({ name: "SoSe22" });

  let result = await Stage.create({
    //Date and time in UTC
    currentStage: "COURSE-SELECTION", //"IDLE", "COURSE-SELECTION", "EVALUATION", "COURSE-RESULT"
    nextDates: {
      idle: [{ date: "2023-01-15" }],
      courseSelection: [{ date: "2023-01-16" }],
      evaluation: [{ date: "2022-02-09T11:10:00Z" }],
      courseResult: [{ date: "2023-02-09T09:55:00Z" }],
    },
    currentSemester: sem._id,
  });
  console.log("----");
  console.log("database seeded with:");
  console.log("----");
  console.log("Stage: " + result);
  console.log("----");
  return ".";
}
