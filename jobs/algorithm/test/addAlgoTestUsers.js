const User = require("../../../model/user"),
  ModalCourse = require("../../../model/modalCourse"),
  CourseSelection = require("../../../model/courseSelection"),
  Semester = require("../../../model/semester"),
  StudyPlan = require("../../../model/studyPlan"),
  bcrypt = require("bcryptjs"),
  seedrandom = require("seedrandom"),
  util = require("util");

module.exports.addAlgoTestUsers = async () => {
  console.log("seed DB with config: ");

  //clean up
  await CourseSelection.deleteMany({});
  await StudyPlan.deleteMany({});
  await ModalCourse.deleteMany({});
  await User.deleteMany({});

  //load config
  const config = require("./config.json");
  console.log(util.inspect(config, false, null, true));

  //get semester
  const semester = await Semester.findOne({ name: "SoSe22" });
  const correctSemester = await Semester.findOne({ name: "SoSe20" });

  //seed Math.random()
  seedrandom(config.seed, { global: true });

  //fill DB
  await addModalCourses(semester, config.modalCourse);
  await addTestUsers(config.user, correctSemester, semester);
  await addSemesterPlans(config.user);
  await addCourseSelection(config, semester);

  //console.log(JSON.stringify(courseSelection));
  console.log("finished");

  //console.log(`found the current semester: ${currSemester.name}`);
  return ".";
};

const addCourseSelection = async (config, semester) => {
  const users = await User.find();

  const courses = await ModalCourse.find();
  let coursesForSelection = [];
  courses.forEach((course) => {
    coursesForSelection.push({ code: course.code, name: course.name, ects: 5 });
  });

  await User.updateMany({}, {});
  for (let i = 0; i < users.length; i++) {
    const maxCourses = pickPropability(config.user.maxCoursesPropabilities);

    const numOfCoursesToPick =
      maxCourses + Math.random * (courses.length - maxCourses);

    const [booked, unbooked] = pickCourses(
      config.user.propabilities,
      coursesForSelection,
      numOfCoursesToPick,
      config.modalCourse.popularity
    );

    const selection = await CourseSelection.create({
      semesterPlans: [
        {
          semester: semester._id,
          unbookedCourses: unbooked,
          bookedCourses: booked,
          maxCourses: maxCourses,
          selectionReasons: [],
        },
      ],
    });

    await User.updateOne(
      { username: `test${i}` },
      {
        $set: {
          courseSelection: selection._id,
        },
      }
    );
  }
};
const pickPropability = (propabilities) => {
  let prop = JSON.parse(JSON.stringify(propabilities));
  normalize(prop);
  let rng = Math.random();
  let ret;
  for (const [key, value] of Object.entries(prop)) {
    if (rng <= value) {
      ret = key;
      break;
    } else {
      rng -= value;
    }
  }
  return ret;
};

const normalize = (propabilities) => {
  const sum = Object.values(propabilities).reduce((acc, curr) => acc + curr);
  Object.keys(propabilities).map((key) => {
    propabilities[key] = propabilities[key] / sum;
  });
};

const pickCourses = (
  config,
  coursesForSelection,
  numOfCoursesToPick,
  coursePopularity
) => {
  let popCopy = JSON.parse(JSON.stringify(coursePopularity));
  let avaibleCourses = JSON.parse(JSON.stringify(coursesForSelection));
  const picked = [];
  for (let i = 0; i < numOfCoursesToPick; i++) {
    normalize(popCopy);
    const pick = pickPropability(popCopy);
    picked.push(avaibleCourses[pick]);
    avaibleCourses.splice(pick, 1);
    popCopy.splice(pick, 1);
  }

  for (const [index, course] of Object.entries(picked)) {
    course.isRepeater = Math.random() < config.preferred;
    course.priority = index;
  }
  return [picked, avaibleCourses];
};
const addSemesterPlans = async (config) => {
  const correctStudyplan = {
    program: {
      code: "IMI-B",
      name: "Internationale Medieninformatik B",
      version: "StuPo 28/12",
    },
    semesterPlans: [],
  };
  const studyplan = {
    program: {
      code: "AI-B",
      name: "Angewante Informatik B",
      version: "StuPo 28/12",
    },
    semesterPlans: [],
  };
  const createdStudyPlan = await StudyPlan.create(studyplan);
  const createdCorrectStudyPlan = await StudyPlan.create(correctStudyplan);

  await User.updateMany(
    {},
    {
      $set: {
        studyPlan:
          Math.random() < config.propabilities.correctProgram
            ? createdCorrectStudyPlan._id
            : createdStudyPlan._id,
      },
    }
  );
};

const addModalCourses = async (semester, config) => {
  if (config.places.length < 6)
    throw new Error("TestConfig: not enough places defined");
  const ModalCourseData = [
    {
      name: "AI for Games",
      code: "GT1",
      availablePlaces: config.places[0],
    },
    {
      name: "Game Technology & Interactive Systems",
      code: "GTAT1",
      availablePlaces: config.places[0],
    },
    {
      name: "Bild- und Videokompression",
      code: "VC1",
      availablePlaces: config.places[0],
    },
    {
      name: "Visual Computing",
      code: "VCAT1",
      availablePlaces: config.places[0],
    },
    {
      name: "Verteilte Systeme",
      code: "WT1",
      availablePlaces: config.places[0],
    },
    {
      name: "Web Technology",
      code: "WTAT1",
      availablePlaces: config.places[0],
    },
  ];

  for (let course of ModalCourseData) {
    course.students = [];
    course.semester = semester._id;
    course.program = "IMI-B";
    course.semesterInProgram = [5, 6];

    await ModalCourse.create(course);
  }
};
const addTestUsers = async (config, correctSemester, semester) => {
  const userData = [];
  for (let i = 0; i < config.count; i++) {
    userData.push(
      new User({
        username: `test${i}`,
        password: bcrypt.hashSync("test", 8),
        email: `test${i}@mail.de`,
        isVerified: true,
        isAdmin: false,
        isPreferred: Math.random() < config.propabilities.preferred,
        startOfStudy:
          Math.random() < config.propabilities.correctSemester
            ? correctSemester._id
            : semester._id,
      })
    );
  }
  await User.create(userData);
};
