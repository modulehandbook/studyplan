const Stage = require("../model/stage");
const ModalCourse = require("../model/modalCourse");
const User = require("../model/user");
require("../model/semester");
require("../model/studyPlan");
require("../model/courseSelection");

module.exports.saveSurveyResults = async () => {
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

  const currentSemester = stage[0].currentSemester.name;
  const finalReasons = {};

  modalCourse
    .filter((course) => course.semester.name == currentSemester)
    .forEach((course) => {
      finalReasons[course.code] = {
        teacher: 0,
        time: 0,
        interest: 0,
        easy: 0,
        careerRelevant: 0,
        other: [],
      };
    });

  users
    .filter((user) => user.courseSelection !== undefined)
    .filter((user) => user.courseSelection.semesterPlans !== undefined)
    .filter((user) => user.courseSelection.semesterPlans.length !== 0)
    .forEach((user) => {
      const semPlan = user.courseSelection.semesterPlans.find((plan) => {
        if (plan.semester == undefined) return false;
        return plan.semester.name == currentSemester;
      });
      if (semPlan == undefined) return;
      parseReasons(finalReasons, semPlan.selectionReasons);
    });
  console.log(finalReasons);

  for (const course in finalReasons) {
    await ModalCourse.updateOne(
      {
        code: course,
        semester: stage[0].currentSemester._id,
      },
      {
        $set: {
          reasonsForSelection: finalReasons[course],
        },
      }
    );
  }
};

const parseReasons = function (finalReasons, input) {
  input.forEach((course) => {
    if (course.code == undefined || course.code == "") return;
    if (course.other != undefined) {
      finalReasons[course.code].other = course.other;
    }
    course.reasons.forEach((reason) => {
      if (finalReasons[course.code][reason] != undefined)
        finalReasons[course.code][reason]++;
    });
  });
};
