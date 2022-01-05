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
      .populate("semester")
      .then((modalCourse) => {
        res.json(modalCourse);
      })
      .catch((error) => {
        console.log(`Error Fetching ModalCourse: ${error.message}`);
      });
  },
  update: (req, res) => {
    let modalCourseId = req.params.id;

    ModalCourse.findByIdAndUpdate(
        modalCourseId,
      {
        $set: {
          students: req.body.students,
        },
      },
      { new: true }
    )
      .populate("semester")
      .then((modalCourse, err) => {
        if (err) console.log(err.message);
        else {
          res.json(modalCourse);
        }
      });
  },
};
