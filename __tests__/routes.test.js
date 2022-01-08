const request = require("supertest");
const db = require("./config/dbHandler.js");
const email = require("./config/emailHandler.js");
const https = require("https");
const EmlParser = require("eml-parser");
const fs = require("fs");

afterAll(async () => await db.connect());
//afterEach(async () => await db.clearDatabase());
//afterAll(async () => await db.closeDatabase());

describe("users", () => {
  describe("users/register", () => {
    let emailURL;
    test("send registration request", (done) => {
      request("http://localhost:3001")
        .post("/users/register")
        .send({
          username: "test",
          email: "test@mail.de",
          password: "testPass",
        })
        .expect((response) => {
          emailURL = response.text + "/message.eml";
        })
        .expect(200, done);
    });
    test("read email", (done) => {
      let res = getVerificationCode(emailURL);
      console.log(res);
      done();
    });
  });
});

function getVerificationCode(url) {
  // Download the file
  console.log("yes");
  https.get(url, (res) => {
      console.log("yes");
      // Open file in local filesystem
      const file = fs.createWriteStream("email.eml");

      // Write data into local file
      res.pipe(file);

      // Close the file
      file.on("finish", () => {
        file.close();
        console.log(`File downloaded!`);

        new EmlParser(fs.createReadStream("email.eml"))
          .parseEml()
          .then((result) => {
            console.log(result.text);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .on("error", (err) => {
      console.log("Error: ", err.message);
    });
}
