const fs = require("fs");
const https = require("https");
const EmlParser = require("eml-parser");

module.exports.getVerificationCode = (url, callback) => {
  // Download the file
  https
    .get(url, (res) => {
      // Open file in local filesystem
      fs.mkdir("tmp-test", (err) => {
        if (err) throw err;
      });
      const file = fs.createWriteStream("tmp-test/email.eml");
      // Write data into local file
      res.pipe(file);
      // Close the file
      file.on("finish", () => {
        file.close();

        new EmlParser(fs.createReadStream("tmp-test/email.eml"))
          .parseEml()
          .then(async (result) => {
            let str = result.text.split("confirmation/")[1];
            callback(str);
          })
          .catch(async (err) => {
            console.log(err);
          });
      });
    })
    .on("error", async (err) => {
      console.log("Error: ", err.message);
    });
};
