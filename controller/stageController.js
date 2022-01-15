const Stage = require("../model/stage");
module.exports = {
  getStage: (req, res) => {
    Stage.find()
      .then((stage) => {
        res.json(stage[0]);
      })
      .catch((error) => {
        console.log("Error fetching Stage: " + error);
      });
  },
};
