//const modalCourse = require("../model/modalCourse");
//const { populate } = require("../model/user");
const User = require("../model/user"),
ModalCourse = require("../model/modalCourse");
module.exports = {
  create: (req, res) => {
    let modalCourseParams = {
      name: req.body.name,
      code: req.body.code,
      semester: req.body.semester,
      availablePlaces: req.body.availablePlaces,
    };
    ModalCourse.create(modalCourseParams)
      .then((modalCourse) => {
        res.json(modalCourse);
      })
      .catch((error) => {
        console.log(`Error saving ModalCourse: ${error.message}`);
        return;
      });
  },
  delete: (req, res) => {
    ModalCourse.findByIdAndRemove(req.params.id)
      .then(async () => {
      })
      .catch((error) => {
        console.log(`Error deleting ModalCourse by ID: ${error.message}`);
        return;
      });
  },
  show: (req, res) => {
    ModalCourse.findById(req.params.id)
        .then((modalCourse) => {
            res.json(modalCourse);
        })
      .catch((error) => {
        console.log(`Error fetching modalCourse by ID: ${error.message}`);
      });
  },
  showAll: (req, res) => {
    ModalCourse.find()
      .populate("semester students")
      .then((modalCourse) => {
        res.json(modalCourse);
      })
      .catch((error) => {
        console.log(`Error Fetching ModalCourse: ${error.message}`);
      });
  },
  update: (req, res) => {
    let semesterId = req.params.id;
    
    ModalCourse.find({semester: semesterId})
    .populate("semester")
    .then((modalCourses) => {
      let CoursesInThisSemester = {};
      
      modalCourses.forEach((modalCourse) =>{
        CoursesInThisSemester[modalCourse.code] = {
          id: modalCourse.id,
          students: [],
          availablePlaces: modalCourse.availablePlaces,
        };
      });
      
      //CoursesInThisSemester[modalCourses[0].code] = {test:1, test2: "test"};
      res.json(CoursesInThisSemester);
      /*
      User.find()
        .populate("courseSelection")
        then((users) => {
          users.forEach((user) => {
            const userId = user._id
            user.courseSelection.semesterPlans.find(
              (semesterPlan) => semesterPlan.semester === semesterId)
              .bookedCourses.forEach((course) => {
                CoursesInThisSemester[course.code].students.push({
                  user: userId,
                  priority: course.priority,
                });
              });
          });
        
        });
        */
    })
    .catch((error) => {
      console.log(`Error updating courses: ${error.message}`);
    });
    /*
    if(999 == 22)return;
    User.find()
      .populate("courseSelection")
      .then((users) => {
        let courseSelections = [];
        for(user in users){
          for(semesterplan in user.courseSelection.semesterPlans){
            if(semesterplan.semester === semesterId)courseSelections.push(
              {user: user, bookedCourses: semesterplan.bookedCourses,});
          }
        }
      

        ModalCourse.updateMany(
          {semester: semesterId}, 
          {
            students: users,
          },
          {new: true}
          )
          .populate('semester students')
          .then((modalCourses, err) => {
            if (err)console.log(err.message);
            else res.json(modalCourses);
          });
      });
      */
  },
};
