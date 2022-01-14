const modalCourseController = require("../controller/modalCourseController"),
  router = require("express").Router();

router.post("/create", modalCourseController.create);
router.get("", modalCourseController.showAll);
router.get("/:id", modalCourseController.show);
router.put("/", modalCourseController.updateAll);
router.put("/updatesurvey", modalCourseController.update);
router.delete("/:id", modalCourseController.delete);

module.exports = router;
