let url;
if (process.env.NODE_ENV == "production") {
  url = "https://studyplan.herokuapp.com/";
} else {
  url = "http://localhost:3000/";
}

module.exports = {
  url: url,
};
