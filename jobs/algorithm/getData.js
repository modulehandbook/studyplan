const Stage = require("../../model/stage");
const ModalCourse = require("../../model/modalCourse");
const User = require("../../model/user");
const Semester = require("../../model/semester");
require("../../model/studyPlan");
require("../../model/courseSelection");

module.exports.getData = async () => {
  const data = {};

  let semesters = await Semester.find()
    .exec()
    .catch((err) => {
      console.log(err);
    });
  //only Semester Names remain
  semesters = semesters.map((sem) => sem.name);
  //I guess all Stages get fetched. to retrieve the current semester
  //
  const stage = await Stage.find()
    .populate("currentSemester")
    .exec()
    .catch((err) => {
      console.log(err);
    });
  /*
  */
  const users = await User.find()
    .populate({
      path: "courseSelection",
      populate: {
        path: "semesterPlans",
        populate: {
          path: "semester",
        },
      },
    })
    .populate({
      path: "studyPlan",
    })
    .populate({
      path: "startOfStudy",
    })
    .exec()
    .catch((err) => {
      console.log(err);
    });

  const modalCourse = await ModalCourse.find()
    .populate("semester")
    .exec()
    .catch((err) => {
      console.log(err);
    });

  // add current Semester - damn(leonard)
  //console.log(stage[0]);
  data.currentSemester = stage[0].currentSemester.name;

  data.users = [];
  users
    .filter((user) => user.courseSelection !== undefined)
    .filter((user) => user.courseSelection.semesterPlans !== undefined)
    .filter((user) => user.courseSelection.semesterPlans.length !== 0)
    .forEach((user) => {
      const newUser = {};
      newUser.email = user.email;
      newUser.isPreferred = user.isPreferred;
      newUser.program = user.studyPlan.program.code;
      newUser.semester = calcSemesterDiff(
        user.startOfStudy.name,
        data.currentSemester,
        semesters
      );
      const semPlan = user.courseSelection.semesterPlans.find((plan) => {
        if (plan.semester == undefined) return false;
        return plan.semester.name == data.currentSemester;
      });
      if (semPlan == undefined) return;
      newUser.bookedCourses = semPlan.bookedCourses.map((course) => {
        return {
          code: course.code,
          priority: course.priority,
          isRepeater: course.isRepeater, 
        };
      });
      newUser.maxCourses = semPlan.maxCourses;
      data.users.push(newUser);
    });

  data.courses = [];
  modalCourse
    .filter((course) => course.semester.name == data.currentSemester)
    .forEach((course) => {
      const newCousre = {};
      newCousre.code = course.code;
      newCousre.availablePlaces = course.availablePlaces;
      newCousre.program = course.program;
      newCousre.semesterInProgram = course.semesterInProgram;
      data.courses.push(newCousre);
    });
  return data;
};

const calcSemesterDiff = function (from, to, semesters) {
  //e.g. started at SoSe10(index: 0) and the selection is for WiSe10/11(index: 1) -> the user is than in the 2. semester
  if (!semesters.some((e) => e === to) || !semesters.some((e) => e === from))
    throw new Error("Semester not in Semester-List");
  return semesters.indexOf(to) - semesters.indexOf(from) + 1;
};
