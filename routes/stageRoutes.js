const stageController = require("../controller/stageController"),
  router = require("express").Router();

router.get("", stageController.getStage);

module.exports = router;
