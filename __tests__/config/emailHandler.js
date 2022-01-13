const fs = require("fs");
const https = require("https");
const EmlParser = require("eml-parser");

module.exports.getVerificationCode = (url, callback) => {
  getEmailContent(url, (content) => {
    let str = content.text.split("confirmation/")[1];
    callback(str);
  });
};

module.exports.getPassword = (url, callback) => {
  getEmailContent(url, (content) => {
    let str = content.text.split("soon.\n\n")[1];
    callback(str.split("\n")[0]);
  });
};

function getEmailContent(url, callback) {
  // Download the file
  https
    .get(url, (res) => {
      // Open file in local filesystem
      if (!fs.existsSync("tmp-test")) {
        fs.mkdir("tmp-test", (err) => {
          if (err) throw err;
        });
      }
      const file = fs.createWriteStream("tmp-test/email.eml");
      // Write data into local file
      res.pipe(file);
      // Close the file
      file.on("finish", () => {
        file.close();

        new EmlParser(fs.createReadStream("tmp-test/email.eml"))
          .parseEml()
          .then(async (result) => {
            callback(result);
          })
          .catch(async (err) => {
            console.log(err);
          });
      });
    })
    .on("error", async (err) => {
      console.log("Error: ", err.message);
    });
}
