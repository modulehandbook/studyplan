//taken from: https://dev.to/paulasantamaria/testing-node-js-mongoose-with-an-in-memory-database-32np
const mongoose = require("mongoose");

/**
 * Connect to the in-memory database.
 */
module.exports.connect = async () => {
  const uri = "mongodb://localhost:27018/";

  await mongoose
    .connect(uri)
    .catch((err) => {
      console.log(err.stack);
      process.exit(1);
    })
    .then(() => {
      console.log("connected to db in test environment");
    });
};

/**
 * Drop database, close the connection and stop mongod.
 */
module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

/**
 * Remove all the data for all db collections.
 */
module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
