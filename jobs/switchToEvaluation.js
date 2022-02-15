const Stage = require("../model/stage");
const { parentPort } = require("worker_threads");
const mongoose = require("mongoose");
const { getData } = require("./algorithm/getData");
const { algo } = require("./algorithm/algoV1");
const crypto = require("crypto");
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

  writeFileSync("./jobs/solution.json", solutionToJSON);
  writeFileSync("./jobs/courseWishes.json", courseWishesToJSON);

  const public = {};
  public.courseWishes = [];
  public.solution = {};

  function hash(string) {
    return crypto.createHash("md5").update(string).digest("hex");
  }

  for (const user of data.users) {
    user.user = hash(user.email);
    delete user.email;
    public.courseWishes.push(user);
  }

  for (const course in data.courses) {
    public.solution[course] = [];
  }

  for (const [courseCode, users] of Object.entries(solution)) {
    for (const user of users) {
      user.user = hash(user.email);
      delete user.email;
      public.solution[courseCode].push(user);
    }
  }

  public.availablePlaces = {};
  for (const [key, value] of Object.entries(data.courses)) {
    public.availablePlaces[key] = value.availablePlaces;
  }

  const publicToJSON = JSON.stringify(public, null, 2);
  writeFileSync("./jobs/publicData.json", publicToJSON);

  if (parentPort) parentPort.postMessage("done");
  else process.exit(0);
})();
