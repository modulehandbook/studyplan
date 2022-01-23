const util = require("util");

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

module.exports.algo = (data) => {
  //init openCourseWishes
  let openCourseWishes = {};
  for (const courseCode in data.courses) {
    //add ranks
    openCourseWishes[courseCode] = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
    };
  }

  //fill openCourseWishes = { 0: [{email: test@mail.de, priority: 2}, {email,priority:}]}
  data.users.forEach((user) => {
    user.bookedCourses.forEach((chosenCourse) => {
      openCourseWishes[chosenCourse.code][
        calcRank(user, chosenCourse, data)
      ].push({
        email: user.email,
        priority: chosenCourse.priority,
      });
    });
  });

  //init solution
  let solution = {};
  for (const courseCode in openCourseWishes) {
    solution[courseCode] = [];
  }

  //main loop
  let iterations = 0;
  while (iterations < 10) {
    assignOpenWishesToSolution(data, openCourseWishes, solution);
    const satisfiedUsers = removeOverheadCourses(data, solution);
    cleanCourseWishes(openCourseWishes, satisfiedUsers);
    iterations++;
  }

  //remove priority from solution
  for (const [courseCode, students] of Object.entries(solution)) {
    solution[courseCode] = students.map((student) => student.email);
  }
  return solution;
};

const assignOpenWishesToSolution = (data, openCourseWishes, solution) => {
  //for all courses
  for (const [courseCode, course] of Object.entries(openCourseWishes)) {
    //for all ranks
    for (const [, studentList] of Object.entries(course)) {
      //sort the studentlist
      const sortedStudents = studentList
        .sort(() => 0.5 - Math.random())
        .sort((student1, student2) => student1.priority - student2.priority);

      //calac how may places remain
      let remainingPlaces =
        data.courses[courseCode].availablePlaces - solution[courseCode].length;

      //assign as many students as possible
      solution[courseCode].push(...sortedStudents.splice(0, remainingPlaces));
    }
  }
};

const removeOverheadCourses = (data, solution) => {
  let satisfiedUsers = [];
  //for all users
  data.users.forEach((user) => {
    //get all courses in solution, where the user is assigned
    let assignedCourses = getAssignedCourses(user, solution);

    const unwantedCourses = assignedCourses
      .sort((course1, course2) => course2.priority - course1.priority)
      .splice(0, assignedCourses.length - user.maxCourses);

    if (unwantedCourses.length > 0) {
      satisfiedUsers.push(user.email);
      removeUnwantedCourses(unwantedCourses, solution, user);
    }

    console.log({
      email: user.email,
      courses: assignedCourses.length,
      maxCourses: user.maxCourses,
    });
  });

  return satisfiedUsers;
};

//get all courses in solution, where the user is assigned
const getAssignedCourses = (user, solution) => {
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
  return assignedCourses;
};

const removeUnwantedCourses = (unwantedCourses, solution, user) => {
  unwantedCourses.forEach((course) => {
    solution[course.code].splice(
      solution[course.code].findIndex(
        (userInCourse) => user.email === userInCourse.email
      ),
      1
    );
  });
};

const cleanCourseWishes = (openCourseWishes, satisfiedUsers) => {
  //for all courses
  for (const [courseCode, course] of Object.entries(openCourseWishes)) {
    //for all ranks
    for (const [rank, studentList] of Object.entries(course)) {
      //remove CourseWishes from satisfied users
      openCourseWishes[courseCode][rank] = studentList.filter(
        (student) => !satisfiedUsers.some((user) => student.email === user)
      );
    }
  }
};

const calcRank = (user, course, data) => {
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
