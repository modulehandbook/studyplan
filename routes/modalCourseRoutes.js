const modalCourseController = require("../controller/modalCourseController"),
  router = require("express").Router();

router.get("", modalCourseController.showAll);
router.get("/:id", modalCourseController.show);
router.put("/", modalCourseController.updateAll);
router.put("/updatesurvey", modalCourseController.update);

// create and delete are deprecated for now. Courses will be added directly to th Database via Seed.
//router.post("/create", modalCourseController.create);
//router.delete("/:id", modalCourseController.delete);

module.exports = router;
