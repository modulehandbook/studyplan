const util = require("util");

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
      code: "VC1";isRepeater
      availablePlaces: 22-55,
      program: "IMI-B";
      semesterInProgram: [5,6];
    }],
     currentSemester: "SoSe22"
  };
  */
  const temp = {};

  let rankedCourses = {};
  data.courses.forEach((course) => {
    rankedCourses[course.code] = {
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
      return 1;
    if (course.isRepeater) return 2;
    if (isRightProgram) return 3;
    return 4;
  };

  data.users.forEach((user) => {
    user.bookedCourses.forEach((chosenCourse) => {
      //if(calcRank(user,chosenCourse) < 3)console.log("user is in right rank");
      rankedCourses[chosenCourse.code][calcRank(user, chosenCourse)].push({
        email: user.email,
        priority: chosenCourse.priority,
      });
    });

    //console.log(user);
  });
  /*
for (const item of Object.entries(items)) {
  console.log(item)
}*/
  //console.log(util.inspect(rankedCourses, {showHidden: false, depth: null, colors: true}));
  let solution = {};
  for (const [courseCode, course] of Object.entries(rankedCourses)) {
    let studentsInCourse = [];
    //console.log(course);
    //console.log(rankedCourses[courseCode]);
    for (const [rank, studentList] of Object.entries(course)) {
      //console.log(studentList[1]);
      let remainingPlaces =
        data.courses[courseCode].availablePlaces - studentsInCourse.length;
      //console.log(remainingPlaces);
      const sortedStudents = studentList
        .sort(() => 0.5 - Math.random())
        .sort((student1, student2) => student1.priority - student2.priority);
      //console.log(sortedStudents);
      studentsInCourse.push(...sortedStudents.splice(0, remainingPlaces));
    }
    //console.log(courseCode + ":")
    solution[courseCode] = studentsInCourse; //.map((student) => student.email);
    //console.log(studentsInCourse);
  }
  console.log(solution);
  let usersToDo = users;
  data.users.forEach((user) => {
    let assignedCourses = [];
    for (const [courseCode, course] of Object.entries(solution)) {
      course.forEach((userInCourse) => {
        if (userInCourse.email === user.email)
          assignedCourses.push({
            code: courseCode,
            priority: userInCourse.priority,
          });
      });
    }
    //console.log(util.inspect({email: user.email, numOfCourses: assignedCourses, maxCourses: user.maxCourses}, {showHidden: false, depth: null, colors: true}));

    const unwantedCourses = assignedCourses
      .sort((course1, course2) => course2.priority - course1.priority)
      .splice(0, assignedCourses.length - user.maxCourses);
      unwantedCourses.forEach((course) => {
        solution[course.code].splice(solution[course.code].findIndex((userInCourse) => user.email === userInCourse.email), 1)
      })
    console.log({
      email: user.email,
      courses: assignedCourses,
      coursesToDelete: unwantedCourses,
      maxCourses: user.maxCourses,
    });
  });
  console.log(solution);
  //console.log(rankedCourses);
  //console.log(util.inspect(rankedCourses, {showHidden: false, depth: null, colors: true}));
  // console.log(util.inspect(data.users, {showHidden: false, depth: null, colors: true}));

  return solution;
};
