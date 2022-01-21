const util = require('util')


module.exports.algo = (data) => {
  data.length;
  /*
  data {
    users: [{
      email = user.email;
      isPreferred = true || false;
      program = "IMI-B";
      maxCourses = 100; //TODO 1- 6
      semester = 0-99999,
      bookedCourses: [{
          code: "VC1",
          priority: 1 - 6,
          isRepeater: true || false, //
      }],
    }], 
    courses: [{
      code: "VC1";
      availablePlaces: 22-55,
      program: "IMI-B";
      semesterInProgram: [5,6];
    }],
     currentSemester: "SoSe22"
  };
  */
  const temp = {};
  console.log(data);

  let obj = {};
  data.courses.forEach((course) => {
    obj[course.code] = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
    };
    temp[course.code] = course;
  });

  data.courses = temp;
  const calcRank = (user, course) => {
    if (user.isPreferred) return 0;
    const isRightProgram = data.courses[course.code].program === user.program;
    if (
      isRightProgram &&
      data.courses[course.code].semesterInProgram.some(
        (sem) => sem === user.semester
      )
    )
      return 1; //0-5
    if (course.isRepeater) return 2;
    if (isRightProgram) return 3;
    return 4;
  };

  data.users.forEach((user) => {
    user.bookedCourses.forEach((chosenCourse) => {
      obj[chosenCourse.code][calcRank(user, chosenCourse)].push(
        {
         email: user.email,
         priority: chosenCourse.priority,
        }
        );
    });
  });

  //console.log(obj);
  console.log(util.inspect(obj, {showHidden: false, depth: null, colors: true}));
  const solution = [
    {
      code: "WT1",
      students: ["test@mail.de", "admin@mail.de"],
    },
  ];
  return solution;
};
