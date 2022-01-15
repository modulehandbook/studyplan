const User = require("../model/user"),
  StudyPlan = require("../model/studyPlan"),
  Semester = require("../model/semester"),
  ModalCourse = require("../model/modalCourse"),
  CourseSelection = require("../model/courseSelection"),
  Stage = require("../model/stage"),
  mongoose = require("mongoose"),
  bcrypt = require("bcryptjs");

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
  });

async function loadUser() {
  await Semester.deleteMany({});
  await StudyPlan.deleteMany({});
  await User.deleteMany({});
  await ModalCourse.deleteMany({});
  await CourseSelection.deleteMany({});
  await Stage.deleteMany({});

  await Stage.create({
    currentStage: "IDLE",
    nextDates: {
      idle: [{ date: "2022-01-15" }],
      courseSelection: [{ date: "2022-01-16" }],
      evaluation: [
        { date: "2022-01-17" },
        { date: "2022-01-16" },
        { date: "2022-01-15" },
        { date: "2022-01-14" },
      ],
      courseResult: [{ date: "2022-01-18" }],
    },
    //TODO add currentSemester
  });

  let semesterData = [];
  let i = 10;
  for (i; i < 70; i++) {
    semesterData.push({ name: `SoSe${i}` });
    semesterData.push({ name: `WiSe${i}/${i + 1}` });
  }
  for (let semester in semesterData) {
    await Semester.create(semesterData[semester]);
  }

  const userData = [
    new User({
      username: "test",
      password: bcrypt.hashSync("test", 8),
      email: "test@mail.de",
      isVerified: true,
    }),
  ];

  const users = await User.create(userData);

  console.log("----");
  console.log("database seeded with:");
  console.log("----");
  console.log("users: " + JSON.stringify(users));
  console.log("----");
  return ".";
}

loadUser().then(() => {
  mongoose.disconnect();
  console.log("database connection closed after seeding.");
});
