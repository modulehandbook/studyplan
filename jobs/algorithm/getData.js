const Stage = require("../../model/stage");
const ModalCourse = require("../../model/modalCourse");
const User = require("../../model/user");
const CourseSelection = require("../../model/courseSelection");
const Semester = require("../../model/semester");
const Studyplan = require("../../model/studyPlan");

module.exports.getData = async () => {
  const data = {};

  let semesters = await Semester.find()
    .exec()
    .catch((err) => {
      console.log(err);
    });
  semesters = semesters.map((sem) => sem.name);

  const stage = await Stage.find()
    .populate("currentSemester")
    .exec()
    .catch((err) => {
      console.log(err);
    });

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

  // add current Semester
  data.currentSemester = stage[0].currentSemester.name;
  data.users = [];

  console.log(semesters);
  console.log(stage);
  console.log(users[0].courseSelection.semesterPlans);
  users
    .filter((user) => user.courseSelection !== undefined)
    .filter((user) => user.courseSelection.semesterPlans !== undefined)
    .filter((user) => user.courseSelection.semesterPlans.length !== 0)
    .forEach((user) => {
      const newUser = {};
      newUser.email = user.email;
      newUser.isPreferred = user.isPreferred;
      newUser.semester = calcSemesterDiff(
        user.startOfStudy.name,
        data.currentSemester,
        semesters
      );
      newUser.program = user.studyPlan.program.code;
      newUser.bookedCourses = {};
      const semPlan = user.courseSelection.semesterPlans.find((plan) => {
        if (plan.semester == undefined) return false;
        return plan.semester.name == data.currentSemester;
      });
      newUser.bookedCourses = semPlan.bookedCourses.map((course) => {
        const o = {};
        o.code = course.code;
        o.priority = course.priority;
        o.isRepeater = undefined; //TODO
        return o;
      });
      data.users.push(newUser);
    });
  console.log(data);
  return data;
};

const calcSemesterDiff = function (from, to, semesters) {
  //e.g. started at SoSe10(index: 0) and the selection is for WiSe10/11(index: 1) -> the user is than in the 2. semester
  if (!semesters.some((e) => e === to) || !semesters.some((e) => e === from))
    throw new Error("Semester not in Semester-List");
  return semesters.indexOf(to) - semesters.indexOf(from) + 1;
};
