const modalCourseController = require("../controller/modalCourseController"),
  router = require("express").Router();

router.post("/create", modalCourseController.create);

router.get("/:id", modalCourseController.show);
router.put("/:id", modalCourseController.update);
router.delete("/:id", modalCourseController.delete);

module.exports = router;
