const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  cors = require("cors"),
  router = require("./routes/index"),
  history = require("connect-history-api-fallback"),
  serveStatic = require("serve-static"),
  Bree = require("./services/breeService"),
  Graceful = require("@ladjs/graceful");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let mongodbURI;
if (process.env.NODE_ENV == "TEST") {
  mongodbURI = "mongodb://mongo-test-db:27017/studyplan";
} else {
  mongodbURI = process.env.MONGODB_URI || "mongodb://mongo-db:27017/studyplan";
}

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
if (process.env.NODE_ENV == "TEST") {
  app.set("port", 3001);
} else {
  app.set("port", process.env.PORT || 3000);
}
app.set("view engine", "ejs"); //To use EJS

// Serve static assets
// app.use(express.static(path.join(__dirname, 'dist')));

// // Redirect all requests to `index.html`
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// })

app.use(serveStatic(__dirname + "/dist"));

if (process.env.NODE_ENV == "production") {
  app.use("/api", router);
} else {
  app.use("/", router);
}

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});

Bree.createBree()
  .then((bree) => {
    // handle graceful reloads, pm2 support, and events like SIGHUP, SIGINT, etc.
    const graceful = new Graceful({ brees: [bree] });
    graceful.listen();

    // start all jobs (this is the equivalent of reloading a crontab):
    bree.start();
  })
  .catch((err) => console.log(err));

module.exports = app;
