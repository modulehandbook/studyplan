const { parentPort } = require("worker_threads");
const CourseSelection = require("../model/courseSelection");
const ModalCourse = require("../model/modalCourse");
const mongoose = require("mongoose");
const mongoose = require("mongoose");
(async () => {
  const mongo = process.env.MONGODB_URI || "mongodb://mongo-db:27017/studyplan";
  await mongoose.connect(mongo, { useNewUrlParser: true }).catch((err) => {
    console.log(err.stack);
    process.exit(1);
  });
})();