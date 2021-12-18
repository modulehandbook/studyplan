const User = require("../model/user"),
  CourseSelection = require("../model/courseSelection");
module.exports = {
  create: (req, res) => {
    let courseselectionParams = {
      testNumber: req.body.testNumber,
    };
    CourseSelection.create(courseselectionParams)
      .then((courseSelection) => {
        res.json(courseSelection);
      })
      .catch((error) => {
        console.log(`Error saving courseSelection: ${error.message}`);
        return;
      });
  },
  delete: (req, res) => {
    CourseSelection.findByIdAndRemove(req.params.id)
      .then(async () => {
      })
      .catch((error) => {
        console.log(`Error deleting courseSelection by ID: ${error.message}`);
        return;
      });
  },
  show: (req, res) => {
    let userId = req.params.id;
    User.findById(userId)
      .then((user) => {
        CourseSelection.findById(user.courseSelection)
          .populate("semesterPlans.semester")
          .then((courseSelection) => {
            res.json(courseSelection);
          });
      })
      .catch((error) => {
        console.log(`Error fetching courseSelection by ID: ${error.message}`);
      });
  },

  update: (req, res) => {
    let courseSelectionId = req.params.id;

    CourseSelection.findByIdAndUpdate(
      courseSelectionId,
      {
        $set: {
          semesterPlans: req.body.semesterPlans,
        },
      },
      { new: true }
    )
      .populate("semesterPlans.semester")
      .then((courseSelection, err) => {
        if (err) console.log(err.message);
        else {
          res.json(courseSelection);
        }
      });
  },
  saveToUser: (req, res) => {
    let userId = req.body.userId;
    let courseSelection = req.body.courseSelection;
    User.findById(userId).then((user) => {
      user.courseSelection = courseSelection;
      user.save((err) => {
        if (err) {
          console.log(err.message);
          return;
        } else {
          res.json(user);
        }
      });
    });
  },
};
