const mongoose = require("mongoose");
const { getData } = require("../getData");
const { updateDB } = require("../updateDB");
const { algo } = require("../algoV1");
const { addAlgoTestUsers } = require("./addAlgoTestUsers");
const util = require("util");

const mongo = process.env.MONGODB_URI || "mongodb://mongo-db:27017/studyplan";
mongoose
  .connect(mongo, { useNewUrlParser: true })
  .catch((err) => {
    console.log(err.stack);
    process.exit(1);
  })
  .then(() => {
    console.log("connected to db in development environment");
    debug().then(() => {
      mongoose.disconnect();
      console.log("database connection closed after seeding.");
      process.exit(0);
    });
  });

async function debug() {
  await addAlgoTestUsers();
  const data = await getData();
  printStatistics(data);
  //console.log(util.inspect(data, false, null, true));
  const solution = algo(data);
  printSolutionStatistics(data, solution);
  await updateDB(solution, data.currentSemester);
  return ".";
}
/*
  data {
    users: [{
      email = user.email;
      isPreferred = true || false;
      program = "IMI-B";
      maxCourses = 100; //
      semester = 0-99999,
      bookedCourses: [{
          code: "VC1",
          priority: 1 - 6,
          isRepeater: true || false, //
      }],
    }], 
    courses: {
      VC1: {
        isRepeater = true;
        availablePlaces: 22-55,
        program: "IMI-B";
        semesterInProgram: [5,6];
      },
      VC2: {
        ...
      },
    },
     currentSemester: "SoSe22"
  };
  */
const printSolutionStatistics = (data, sol) => {
  const solutionPerUser = {};
  const statsPerUser = {};

  for (const [courseCode, users] of Object.entries(sol)) {
    users.forEach((user) => {
      if (solutionPerUser[user] == undefined) solutionPerUser[user] = [];
      if (statsPerUser[user] == undefined) statsPerUser[user] = {};
      solutionPerUser[user].push(courseCode);
    });
  }

  for (const [user, stats] of Object.entries(statsPerUser)) {
    stats.assignedCourses = solutionPerUser[user].length;
  }

  const avgUserStats = {
    assignedCourses:
      Object.entries(statsPerUser)
        .map((stat) => stat[1].assignedCourses)
        .reduce((a, b) => a + b, 0) / Object.entries(statsPerUser).length,
  };

  console.log("##########################################################");
  console.log("########## Statistics after Algo #########################");
  console.log("##########################################################");
  console.log(util.inspect({ avgUserStats: avgUserStats }, false, null, true));
};

const printStatistics = (data) => {
  const users = {};
  users.count = data.users.length;
  users.withPreferred = data.users.filter((user) => user.isPreferred).length;
  users.inCorrectProgram = data.users.filter(
    (user) => user.program == "IMI-B"
  ).length;
  users.inCorrectSem = data.users.filter(
    (user) => user.semester == 5 || user.semester == 6
  ).length;
  users.avgMaxCourses =
    data.users.map((user) => user.maxCourses).reduce((a, b) => a + b, 0) /
    users.count;
  users.avgPickedCourses =
    data.users
      .map((user) => user.bookedCourses.length)
      .reduce((a, b) => a + b, 0) / users.count;

  const courseWishes = {};
  const allWishes = data.users.flatMap((user) => user.bookedCourses);
  courseWishes.count = allWishes.length;
  courseWishes.withRepeater = allWishes.filter(
    (wish) => wish.isRepeater
  ).length;

  courseWishes.countPerCourseAndPrio = {};
  allWishes.forEach((element) => {
    if (courseWishes.countPerCourseAndPrio[element.code] == undefined)
      courseWishes.countPerCourseAndPrio[element.code] = {};
    else {
      if (
        courseWishes.countPerCourseAndPrio[element.code][element.priority] ==
        undefined
      )
        courseWishes.countPerCourseAndPrio[element.code][element.priority] = 1;
      else
        courseWishes.countPerCourseAndPrio[element.code][element.priority] += 1;
    }
  });

  console.log("##########################################################");
  console.log("########## Statistics before Algo ########################");
  console.log("##########################################################");
  console.log("Stats:");
  console.log(
    util.inspect(
      { users: users, courseWishes: courseWishes },
      false,
      null,
      true
    )
  );
};
