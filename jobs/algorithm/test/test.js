const mongoose = require("mongoose");
const { getData } = require("../getData");
const { updateDB } = require("../updateDB");
const { algo } = require("../algoV1");
const { addAlgoTestUsers } = require("./addAlgoTestUsers");
const util = require("util");
const { content_v2_1 } = require("googleapis");

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
/*
    --satisfaction rating--
    ((gotCoursesAmount / maxCourses) * 10 + foreachCourse((ifGotCourse = ? 1 : 0) * (courseLenght - priority))) / ( 10 + courseLength)
    0.5 + upperHalf(0-0.5) - downHalf(0-0.5) 
 */

const createCombDict = () => {
  const aplhabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  const dict = {};
  for (let i = 1; i <= 10; i++) {
    dict[i] = {};
    const combs = combinations(
      aplhabet.filter((e, idx) => idx < i).reduce((a, b) => a + b, "")
    );
    for (let f = 1; f <= i; f++) {
      dict[i][f] = {};
      const possibleCombs = combs.filter((comb) => comb.length === f);
      possibleCombs.forEach((comb, idx) => {
        dict[i][f][comb] =
          (possibleCombs.length - 1 - idx) / (possibleCombs.length - 1);
        if (f === i) dict[i][f][comb] = 1;
      });
    }
  }
  dict[10][10]["ABCDEFGHIJ"] = 1;
  return dict;
};

//taken from: https://codereview.stackexchange.com/questions/7001/generating-all-combinations-of-an-array
const combinations = (str) => {
  var fn = function (active, rest, a) {
    if (!active && !rest) return;
    if (!rest) {
      a.push(active);
    } else {
      fn(active + rest[0], rest.slice(1), a);
      fn(active, rest.slice(1), a);
    }
    return a;
  };
  return fn("", str, []);
};

const printSolutionStatistics = (data, sol) => {
  const solutionPerUser = {};
  const statsPerUser = {};

  const combDict = createCombDict();
  const alphabet = ["error", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

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
  //iterating over every user and their assignedCourses
  for (const [email, assignedCoursesToUser] of Object.entries(
    solutionPerUser
  )) {
    const userData = data.users.find((user) => user.email == email);
    const courseCountSatisfaction =
      assignedCoursesToUser.length / userData.maxCourses;

    const comb = userData.bookedCourses
      .filter((c1) => assignedCoursesToUser.some((c2) => c2 == c1.code))
      .reduce((c1, c2) => c1 + alphabet[c2.priority], "");

    const courseCombSatifaction =
      combDict[userData.bookedCourses.length][assignedCoursesToUser.length][
        comb
      ];

    if (email == "test27@mail.de") {
      console.log({
        bookedCourses: userData.bookedCourses,
        assignedCourses: assignedCoursesToUser,
        maxcourses: userData.maxCourses,
        courseCombSatifaction: courseCombSatifaction,
        courseCountSatisfaction: courseCountSatisfaction,
        sum: (courseCombSatifaction + courseCountSatisfaction) / 2,
      });
    }

    statsPerUser[email].satisfaction =
      (courseCombSatifaction + courseCountSatisfaction) / 2;
  }
  const avgUserStats = {
    assignedCourses:
      Object.entries(statsPerUser)
        .map((stat) => stat[1].assignedCourses)
        .reduce((a, b) => a + b, 0) / Object.entries(statsPerUser).length,
    satisfaction:
      Object.entries(statsPerUser)
        .map((stat) => stat[1].satisfaction)
        .reduce((a, b) => a + b, 0) / Object.entries(statsPerUser).length,
  };

  console.log("##########################################################");
  console.log("########## Statistics after Algo #########################");
  console.log("##########################################################");
  console.log(util.inspect({ avgUserStats: avgUserStats }, false, null, true));
};
const recursiveShit = (number) => {
  if (number === 1) return 3;
  else return number + recursiveShit(number - 1);
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

const calcAverageSatisfaction = (data) => {};
