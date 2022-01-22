const User = require("../model/user"),
  ModalCourse = require("../model/modalCourse"),
  CourseSelection = require("../model/courseSelection"),
  Semester = require("../model/semester"),
  StudyPlan = require("../model/studyPlan"),
  mongoose = require("mongoose");

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

async function loadCourseSelection() {
  await CourseSelection.deleteMany({});
  await StudyPlan.deleteMany({});
  await ModalCourse.deleteMany({});
  const semester = await Semester.findOne({ name: "SoSe22" });
  const ModalCourseData = [
    {
      name: "AI for Games",
      code: "GT1",
      availablePlaces: 3, //TODO
    },
    {
      name: "Game Technology & Interactive Systems",
      code: "GTAT1",
      availablePlaces: 4, //TODO
    },
    {
      name: "Bild- und Videokompression",
      code: "VC1",
      availablePlaces: 4, //TODO
    },
    {
      name: "Visual Computing",
      code: "VCAT1",
      availablePlaces: 2, //TODO
    },
    {
      name: "Verteilte Systeme",
      code: "WT1",
      availablePlaces: 3, //TODO
    },
    {
      name: "Web Technology",
      code: "WTAT1",
      availablePlaces: 5, //TODO
    },
  ];

  for (let course of ModalCourseData) {
    course.students = [];
    course.semester = semester._id;
    course.program = "IMI-B";
    course.semesterInProgram = [5, 6];

    await ModalCourse.create(course);
  }
  
  let users = await User.find();
  const courses = await ModalCourse.find();
  let coursesForSelection = [];
  ModalCourseData.forEach((course) => {
    coursesForSelection.push({ code: course.code, name: course.name, ects: 5 });
  });

  const studyplan = {
    program: {
      code: "IMI-B",
      name: "Internationale Medieninformatik B",
      version: "StuPo 28/12",
    },
    semesterPlans: [],
  };
  for (let i = 0; i < users.length; i++) {
    let unbookedCourses = [];
    coursesForSelection.forEach((course) => unbookedCourses.push(course));
    let bookedcourses = unbookedCourses
      .sort((a, b) => 0.5 - Math.random())
      .splice(0, Math.floor(Math.random() * unbookedCourses.length + 1));
    bookedcourses.forEach(
      (element, index) =>
        (bookedcourses[index] = {
          name: element.name,
          code: element.code,
          ects: element.ects,
          isRepeater: Math.random() < 0.1,
          priority: index + 1,
        })
    );
    const maxCourses = Math.floor(Math.random() * bookedcourses.length);
    let newCourseSelection = {
      semesterPlans: [
        {
          semester: semester._id,
          unbookedCourses: unbookedCourses,
          bookedCourses: bookedcourses,
          maxCourses: maxCourses,
          selectionReasons: [],
        },
      ],
    };
    const createdStudyPlan = await StudyPlan.create(studyplan);
    const courseSelection = await CourseSelection.create(newCourseSelection);
    let test = await User.findByIdAndUpdate(
      users[i]._id,
      {
        $set: {
          courseSelection: courseSelection._id,
          studyPlan: createdStudyPlan._id,
        },
      },
      { new: true }
    ).populate("courseSelection");
    console.log(test);
  }

  //console.log(JSON.stringify(courseSelection));
  console.log("finished");

  //console.log(`found the current semester: ${currSemester.name}`);
  return ".";
}
loadCourseSelection().then(() => {
  mongoose.disconnect();
  console.log("database connection closed after seeding.");
});
