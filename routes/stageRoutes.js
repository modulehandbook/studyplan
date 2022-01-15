const stageController = require("../controller/stageController"),
  router = require("express").Router();

router.post("/currentStage", stageController.getStage);

module.exports = router;
