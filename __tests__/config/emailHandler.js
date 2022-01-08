const fs = require("fs");
const https = require("https");
const EmlParser = require("eml-parser");

module.exports.getVerificationCode = async (url) => {
    let res;
  // Download the file
  https
    .get(url, async (res) => {
      // Open file in local filesystem
      const file =  fs.createWriteStream("email.eml");

      // Write data into local file
      res.pipe(file);

      // Close the file
      file.on("finish", async () => {
        file.close();
        console.log(`File downloaded!`);

        await new EmlParser(fs.createReadStream("email.eml"))
          .parseEml()
          .then(async (result) => {
            console.log(result.text);
            res = result.text
          })
          .catch(async(err) => {
            console.log(err);
          });
      });
    })
    .on("error", async (err) => {
      console.log("Error: ", err.message);
    });
    return res;
};
