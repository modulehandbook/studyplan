let url;
if (process.env.NODE_ENV == "production" && process.env.TEST_PROD != "true") {
  url = "https://studyplan.f4.htw-berlin.de/api/"; 
} else {
  url = "http://localhost:3000/";
}

module.exports = {
  url: url,
};
