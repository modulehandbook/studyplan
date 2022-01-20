const User = require("../model/user"),
ModalCourse = require("../model/modalCourse"),
CourseSelection = require("../model/courseSelection"),
Semester = require("../model/semester"),

mongoose = require("mongoose"),

const mongo = process.env.MONGODB_URI || "mongodb://mongo-db:27017/studyplan";
mongoose
  .connect(mongo, { useNewUrlParser: true })
  .catch((err) => {
    console.log(err.stack);
    process.exit(1);
  })
  .then(() => {
    console.log("connected to db in development environment");
  });

  async function loadCourseSelection(){
    await CourseSelection.deleteMany({});

    


  }