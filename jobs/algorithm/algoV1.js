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
      return 1; //0-5
    if (course.isRepeater) return 2;
    if (isRightProgram) return 3;
    return 4;
  };

  data.users.forEach((user) => {
    user.bookedCourses.forEach((chosenCourse) => {
      rankedCourses[chosenCourse.code][calcRank(user, chosenCourse)].push(
        {
         email: user.email,
         priority: chosenCourse.priority,
        }
        );
    });
  });
/*
for (const item of Object.entries(items)) {
  console.log(item)
}*/
  for(const [courseCode, course] of Object.entries(rankedCourses)){
    studentsInCourse = [];
    //console.log(course);
    //console.log(rankedCourses[courseCode]);
    for(const [rank, studentList] of Object.entries(course)){
      //console.log(studentList[1]);
      let remainingPlaces = data.courses[courseCode].availablePlaces - studentsInCourse.length;
      //console.log(remainingPlaces);
      const sortedStudents = studentList.sort(() => 0.5 - Math.random()).sort((student1, student2) => student1.priority - student2.priority);
      //console.log(sortedStudents);
      studentsInCourse.push(...sortedStudents.splice(0, remainingPlaces));
    }
    console.log(studentsInCourse);
  }
  //console.log(rankedCourses);
  console.log(util.inspect(data, {showHidden: false, depth: null, colors: true}));
  const solution = [
    {
      code: "WT1",
      students: ["test@mail.de", "admin@mail.de"],
    },
  ];
  return solution;
};
