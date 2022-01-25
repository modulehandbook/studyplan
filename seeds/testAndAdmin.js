/*warning
This deletes User and Studyplan; This requires Semester
*/
const User = require("../model/user"),
  StudyPlan = require("../model/studyPlan"),
  Semester = require("../model/semester"),
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
    seedUsers().then(() => {
      mongoose.disconnect();
      console.log("database connection closed after seeding.");
    });
  });

async function seedUsers() {
  await User.deleteMany({});
  await StudyPlan.deleteMany({});

  const semesters = await Promise.all(
    ["SoSe20", "WiSe20/21", "SoSe21", "WiSe21/22", "SoSe22", "WiSe22/23"].map(
      async (sem) => await Semester.find({ name: sem })
    )
  );
  const semID = semesters.map((sem) => sem[0]._id);

  const sp = await StudyPlan.create(createAdminStudyPlan(semID));

  const userData = [
    {
      username: "test",
      password: bcrypt.hashSync("test", 8),
      email: "test@mail.de",
      isVerified: true,
    },
    {
      username: "admin",
      password: bcrypt.hashSync("admin", 8),
      email: "admin@mail.de",
      isVerified: true,
      isAdmin: true,
      isPreferred: false,
      startOfStudy: semID[0],
      studyPlan: sp._id,
    },
  ];

  let result = await Promise.all(
    userData.map(async (user) => await User.create(user))
  );
  console.log("----");
  console.log("database seeded with:");
  console.log("----");
  console.log("users: " + result);
  console.log("----");
  return ".";
}
const createAdminStudyPlan = (semID) => {
  return {
    program: {
      code: "IMI-B",
      name: "Internationale Medieninformatik B",
      version: "StuPo 28/12",
    },
    semesterPlans: [
      {
        semester: semID[0],
        currentSemesterCount: 1,
        plannedCourses: [
          {
            code: "B1",
            name: "Informatik 1",
            ects: 6,
            bookedThrough: [],
            passedThrough: [],
          },
          {
            code: "B2",
            name: "Computersysteme",
            ects: 5,
            bookedThrough: [],
            passedThrough: [],
          },
          {
            code: "B3",
            name: "Propädeutikum und  Medientheorie",
            ects: 5,
            bookedThrough: [],
            passedThrough: [],
          },
          {
            code: "B4",
            name: "Mathematik für Medieninformatik 1",
            ects: 5,
            bookedThrough: [],
            passedThrough: [],
          },
          {
            code: "B5",
            name: "Grundlagen  der  Webprogrammierung",
            ects: 5,
            bookedThrough: [],
            passedThrough: [],
          },
          {
            code: "B6",
            name: "1. Fremdsprache 1",
            ects: 4,
            bookedThrough: [],
            passedThrough: [],
          },
        ],
      },
      {
        semester: semID[1],
        currentSemesterCount: 2,
        plannedCourses: [
          {
            code: "B7",
            name: "Informatik 2",
            ects: 5,
            bookedThrough: [],
            passedThrough: [],
          },
          {
            code: "B8",
            name: "Grundlagen Digitaler Medien",
            ects: 6,
            bookedThrough: [],
            passedThrough: [],
          },
          {
            code: "B9",
            name: "Netzwerke",
            ects: 5,
            bookedThrough: [],
            passedThrough: [],
          },
          {
            code: "B10",
            name: "Mathematik für Medieninformatik 2",
            ects: 5,
            bookedThrough: [],
            passedThrough: [],
          },
          {
            code: "B11",
            name: "Medienwirtschaft",
            ects: 5,
            bookedThrough: [],
            passedThrough: [],
          },
          {
            code: "B12",
            name: "1. Fremdsprache 2",
            ects: 4,
            bookedThrough: [],
            passedThrough: [],
          },
        ],
      },
      {
        semester: semID[2],
        currentSemesterCount: 3,
        plannedCourses: [
          {
            code: "B13",
            name: "Bildverarbeitung",
            ects: 5,
            bookedThrough: [],
            passedThrough: [],
          },
          {
            code: "B14",
            name: "Datenbanken",
            ects: 5,
            bookedThrough: [],
            passedThrough: [],
          },
          {
            code: "B15",
            name: "Informatik 3",
            ects: 6,
            bookedThrough: [],
            passedThrough: [],
          },
          {
            code: "B16",
            name: "2. Fremdsprache",
            ects: 4,
            bookedThrough: [],
            passedThrough: [],
          },
          {
            code: "B17",
            name: "Computergrafik",
            ects: 5,
            bookedThrough: [],
            passedThrough: [],
          },
          {
            code: "B18",
            name: "3D-Design",
            ects: 5,
            bookedThrough: [],
            passedThrough: [],
          },
        ],
      },
      {
        semester: semID[3],
        currentSemesterCount: 4,
        plannedCourses: [
          {
            code: "B19",
            name: "Internationale   Medienwirtschaft  und  Kommunikation",
            ects: 5,
            bookedThrough: [],
            passedThrough: [],
          },
          {
            code: "B20",
            name: "Praxisphase 1:  Fachpraktikum im  Ausland",
            ects: 25,
            bookedThrough: [],
            passedThrough: [],
          },
        ],
      },
      {
        semester: semID[4],
        currentSemesterCount: 5,
        plannedCourses: [
          {
            code: "B21",
            name: "Wahlpflichtmodul 1",
            ects: 5,
            bookedThrough: [],
            passedThrough: [],
          },
          {
            code: "B22",
            name: "Wahlpflichtmodul 2",
            ects: 5,
            bookedThrough: [],
            passedThrough: [],
          },
          {
            code: "B23",
            name: "Wahlpflichtmodul 3",
            ects: 5,
            bookedThrough: [],
            passedThrough: [],
          },
          {
            code: "B24",
            name: "Praxisphase 2:Praxisprojekt",
            ects: 15,
            bookedThrough: [],
            passedThrough: [],
          },
        ],
      },
      {
        semester: semID[5],
        currentSemesterCount: 6,
        plannedCourses: [
          {
            code: "B25",
            name: "Wahlpflichtmodul 4",
            ects: 5,
            bookedThrough: [],
            passedThrough: [],
          },
          {
            code: "B26",
            name: "Wahlpflichtmodul 5",
            ects: 5,
            bookedThrough: [],
            passedThrough: [],
          },
          {
            code: "B28",
            name: "AWE:  WP",
            ects: 2,
            bookedThrough: [],
            passedThrough: [],
          },
          {
            code: "B29",
            name: "Bachelorarbeit",
            ects: 12,
            bookedThrough: [],
            passedThrough: [],
          },
          {
            code: "B30",
            name: "Bachelorseminar/Kolloquium",
            ects: 4,
            bookedThrough: [],
            passedThrough: [],
          },
        ],
      },
    ],
  };
};
