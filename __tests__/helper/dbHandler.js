//taken from: https://dev.to/paulasantamaria/testing-node-js-mongoose-with-an-in-memory-database-32np
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");

const uri = "mongodb://localhost:27018/studyplan";
// Create a new MongoClient
const client = new MongoClient(uri);
/**
 * Connect to the in-memory database.
 */
module.exports.reset = async () => {
  await client.connect();
  // Establish and verify connection
  await client.db("studyplan").command({ ping: 1 });
  console.log("Connected successfully to server");

  const db = client.db("studyplan");
  const names = await db.listCollections().toArray();
  for (const name of names) {
    await db.collection(name.name).deleteMany({});
  }
  client.close();
};

module.exports.loadSeed = function (seedFileName, done) {
  mongoose
    .connect(uri, { useNewUrlParser: true })
    .catch((err) => {
      done(err);
    })
    .then(() => {
      let seed = require("../seeds/" + seedFileName + ".seed.js");

      seed
        .load()
        .catch((err) => {
          done(err);
        })
        .then(() => {
          mongoose.disconnect();
          done();
        });
    });
};
