const courseSelectionController = require("../controller/courseSelctionController"),
  router = require("express").Router();

router.post("/create", courseSelectionController.create);
router.post("/save", courseSelectionController.saveToUser);

router.get("/:id", courseSelectionController.show);
router.put("/:id", courseSelectionController.update);
router.delete("/:id", courseSelectionController.delete);

module.exports = router;
