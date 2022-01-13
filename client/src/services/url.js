let url;
if (process.env.NODE_ENV == "production" && process.env.TEST_PROD != "true") {
  url = "https://studyplan.herokuapp.com/"; //TODO change
} else {
  url = "http://localhost:3000/";
}

module.exports = {
  url: url,
};
