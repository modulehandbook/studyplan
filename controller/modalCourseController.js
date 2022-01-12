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
    let responseJson = [];
    ModalCourse.find({semester: semesterId})
    .populate("semester")
    .then((modalCourses) => {
      let CoursesInThisSemester = {};
      
      modalCourses.forEach((modalCourse) =>{
        CoursesInThisSemester[modalCourse.code] = {
          id: modalCourse._id,
          students: [],
          availablePlaces: modalCourse.availablePlaces,
        };
      });
      
      //CoursesInThisSemester[modalCourses[0].code] = {test:1, test2: "test"};
      
      User.find()
        .populate('courseSelection')
        .then((users) => {
          let currentSemesterPlans = [];
        
          users.forEach((user) =>{
           
            let currentSemesterPlan = user.courseSelection.semesterPlans.find(
              (semesterPlan) => semesterPlan.semester == semesterId
            );
            
            if(currentSemesterPlan)currentSemesterPlan.bookedCourses.forEach(
              (course) => {
                CoursesInThisSemester[course.code].students.push({
                  user: user._id,
                  priority: course.priority,
               });
              });
             // CoursesInThisSemester[currentSemesterPlan.bookedCourses[0].code].students = ["test"];
              
          });
          for(let property in CoursesInThisSemester){
            CoursesInThisSemester[property].students.sort((a, b) => 0.5 - Math.random())
              .sort((student1, student2) => student1.priority > student2.priority);
            const finalArray = CoursesInThisSemester[property].students.slice(0, CoursesInThisSemester[property].availablePlaces)
              .map((element) => element.user);
            ModalCourse.findByIdAndUpdate(
              CoursesInThisSemester[property].id, 
              {
                $set: {
                  students: finalArray,
                },    
              },
              {new: true}
              )
              .populate("students semester")
              .then((moin, err) => {
                if(err) console.log(err.message);
                else res.json(moin);
              });
          }
          //61d337cf87268f001e8ee21b
          
        });
        
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
