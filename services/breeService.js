const Bree = require("bree"),
  Stage = require("../model/stage");

module.exports.createBree = async () => {
  const stage = await Stage.find().exec();
  if (stage.length == 0) throw new Error("no Stage dates defined");
  const nextDates = stage[0].nextDates;
  const jobs = [];
  if (nextDates.idle.length != 0)
    jobs.push({
      name: "switchToIdle",
      date: nextDates.idle[0].date,
    });
  if (nextDates.courseSelection.length != 0)
    jobs.push({
      name: "switchToCourseSelection",
      date: nextDates.courseSelection[0].date,
    });
  if (nextDates.evaluation.length != 0)
    jobs.push({
      name: "switchToEvaluation",
      date: nextDates.evaluation[0].date,
    });
  if (nextDates.courseResult.length != 0)
    jobs.push({
      name: "switchToCoureseResult",
      date: nextDates.courseResult[0].date,
    });
  const bree = new Bree({
    jobs: jobs,
  });
  return bree;
};
