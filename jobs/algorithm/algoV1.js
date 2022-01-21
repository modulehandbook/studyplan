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
  console.log(data);
  /*
  let obj = {};
  data.courses.forEach((course) => {
    obj[course.code] = [];
  });
  data.users.forEach((user) => {
    user.bookeCourses.forEach((chosenCourse) => {
      
    });
  });
  */
  const solution = [
    {
      
      code: "WT1",
      students: ["test@mail.de", "admin@mail.de"],
    },
  ];
  return solution;
};
