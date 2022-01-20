const Stage = require("../../model/stage");
const ModalCourse = require("../../model/modalCourse");
const User = require("../../model/user");
require("../../model/semester");
require("../../model/studyPlan");
require("../../model/courseSelection");

module.exports.getData = async () => {
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

  const finalReasons = [];

  modalCourse
    .filter((course) => course.semester.name == currentSemester)
    .forEach((course) => {
      finalReasons.push({
        code: course.code,
        reasons: {
          teacher: 0,
          time: 0,
          interest: 0,
          easy: 0,
          careerRelevant: 0,
          other: [],
        },
      });
    });
  const currentSemester = stage[0].currentSemester.name;

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

  for (const finalReason of finalReasons) {
    await ModalCourse.updateOne(
      {
        code: finalReason.code,
        semester: stage[0].currentSemester._id,
      },
      {
        $set: {
          reasonsForSelection: finalReason.reasons,
        },
      }
    );
  }
};
