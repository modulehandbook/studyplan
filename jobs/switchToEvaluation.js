const Stage = require("../model/stage");
const { parentPort } = require("worker_threads");
const mongoose = require("mongoose");
const { getData } = require("./algorithm/getData");
const { algo } = require("./algorithm/algoV1");
const { writeFileSync } = require("fs");
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
  nextDates.evaluation.shift();
  await Stage.updateMany(
    {},
    { $set: { currentStage: "EVALUATION", nextDates: nextDates } },
    { new: true }
  )
    .exec()
    .catch((err) => {
      console.log(err);
    });

  const data = await getData();
  const solution = algo(data);
  const solutionToJSON = JSON.stringify(solution, null, 2);
  const courseWishesToJSON = JSON.stringify(data, null, 2);

  writeFileSync("solution.json", solutionToJSON);
  writeFileSync("courseWishes.json", courseWishesToJSON);


  if (parentPort) parentPort.postMessage("done");
  else process.exit(0);
})();
