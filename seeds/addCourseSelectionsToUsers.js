const User = require("../model/user"),
ModalCourse = require("../model/modalCourse"),
CourseSelection = require("../model/courseSelection"),
Semester = require("../model/semester"),

mongoose = require("mongoose");

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
    await Semester.findOne({name: "SoSe22"})
    .then(async (semester) => {
      let users = await User.find();
      const courses = await ModalCourse.find();
      let unbookedCourses = [];
      courses.forEach((course) => {
        unbookedCourses.push({code: course.code, name: course.name, ects: 5});
      });
      let newCourseSelection = {
        semesterPlans: [
          {
            semester: semester._id,
            unbookedCourses: unbookedCourses,
            bookedCourses: [],
            selectionReasons: [],
          },
        ],
      };
      const courseSelection = await (await CourseSelection.create(newCourseSelection)).populate("semesterPlans.semester");
      console.log(JSON.stringify(courseSelection));
      users.forEach(async (user) =>{
        await User.findByIdAndUpdate(user._id, 
          {
            $set: {
              courseSelection: courseSelection._id,
            },
          },
          {new: true});
      });
      await User.findByIdAndUpdate(users[0]._id, 
        {
          $set: {
            courseSelection: courseSelection._id,
          },
        },
        {new: true});
    //console.log(`found the current semester: ${currSemester.name}`);
    });


  }
  loadCourseSelection().then(() => {
    mongoose.disconnect();
    console.log("database connection closed after seeding.");
  });
  