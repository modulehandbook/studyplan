const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  cors = require("cors"),
  router = require("./routes/index"),
  history = require("connect-history-api-fallback"),
  serveStatic = require("serve-static");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongodbURI =
  process.env.MONGODB_URI || "mongodb://mongo-db:27017/studyplan";

//partly from asalant/connectWithRetry.js
var connectWithRetry = function () {
  return mongoose.connect(mongodbURI).then(
    () => {
      console.log("Database is connected");
    },
    (err) => {
      console.error("Can not connect to the database" + err);
      console.error("retrying in 1 sec");
      setTimeout(connectWithRetry, 1000);
    }
  );
};
connectWithRetry();
app.use(
  history({
    // OPTIONAL: Includes more verbose logging
    verbose: true,
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
// app.use(express.static("public")); //In order to use static file

app.use(cors());

// app.use(serveStatic(__dirname + "/dist"));

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs"); //To use EJS

// Serve static assets
// app.use(express.static(path.join(__dirname, 'dist')));

// // Redirect all requests to `index.html`
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// })

app.use(serveStatic(__dirname + "/dist"));

app.use("/", router);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});

module.exports = app;
