let url;
if (process.env.NODE_ENV == "production" && process.env.TEST_PROD != "true") {
  url = "http://studyplan.f4.htw-berlin.de/api/"; //TODO change to https
} else {
  url = "http://localhost:3000/";
}

module.exports = {
  url: url,
};
