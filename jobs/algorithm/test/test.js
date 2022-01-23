const mongoose = require("mongoose");
const { getData } = require("../getData");
const { updateDB } = require("../updateDB");
const { algo } = require("../algoV1");
const { addAlgoTestUsers } = require("./addAlgoTestUsers");

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
  await addAlgoTestUsers();
  const data = await getData();
  await updateDB(algo(data), data.currentSemester);
  return ".";
}
