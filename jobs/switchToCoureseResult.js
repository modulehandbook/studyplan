const Stage = require("../model/stage");
const { parentPort } = require("worker_threads");
const { updateDB } = require("./algorithm/updateDB");
const { saveSurveyResults } = require("./saveSurveyResults");
const mongoose = require("mongoose");
(async () => {
  const mongo = process.env.MONGODB_URI || "mongodb://mongo-db:27017/studyplan";
  await mongoose.connect(mongo, { useNewUrlParser: true }).catch((err) => {
    console.log(err.stack);
    process.exit(1);
  });
  const stage = await Stage.find()
    .exec()
    .catch((err) => {
      console.log(err);
    });
  if (stage.length == 0) throw new Error("no Stage dates defined");
  const nextDates = stage[0].nextDates;
  nextDates.courseResult.shift();
  await Stage.updateMany(
    {},
    { $set: { currentStage: "COURSE-RESULT", nextDates: nextDates } },
    { new: true }
  )
    .exec()
    .catch((err) => {
      console.log(err);
    });

  const solution = require("./solution.json");
  const data = require("./courseWishes.json");

  await updateDB(solution, data.currentSemester);
  await saveSurveyResults();

  if (parentPort) parentPort.postMessage("done");
  else process.exit(0);
})();
