const mongoose = require("mongoose");
const { getData } = require("./getData");

const mongo = process.env.MONGODB_URI || "mongodb://mongo-db:27017/studyplan";
mongoose
  .connect(mongo, { useNewUrlParser: true })
  .catch((err) => {
    console.log(err.stack);
    process.exit(1);
  })
  .then(() => {
    console.log("connected to db in development environment");
    debug().then(() => {
      mongoose.disconnect();
      console.log("database connection closed after seeding.");
      process.exit(0);
    });
  });

async function debug() {
  await getData();
  return ".";
}
