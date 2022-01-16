/* eslint-disable */
//test is under construction 

//     ^
//     |
//     |
//     |
//     |



const request = require("supertest");
const db = require("../../config/dbHandler.js");
const email = require("../../config/emailHandler.js");
const assert = require("assert");

beforeAll(async () => await db.reset());

const url = "http://localhost:3001";
const username = "test_username";
const password = "test_password";
const e_mail = "test@mail.de";

const newUsername = "newName";
const newEmail = "newMail";
const newPassword = "newPass";
const newStartOfStudy = {};
const newStudyPlan = { name: "newSemester" };
const newCourseSelection = {};
const newAccessToken = "newAccessToken";

describe("change user info", () => {
  describe("flawless change user info", () => {
    let id;
    test("seed", (done) => {
      db.loadSeed("testUser", done);
    });
    test("login / get id", (done) => {
      request(url)
        .post("/users/login")
        .send({
          username: username,
          password: password,
        })
        .expect(200)
        .then((res) => {
          id = res.body.id;
          done();
        })
        .catch((e) => done(e));
    });
    test("send change request", (done) => {
      request(url)
        .put("/users/" + id)
        .send({
          username: newUsername,
          email: newEmail,
          //password: newPassword,
          //startOfStudy: newStartOfStudy,
          //studyPlan: newStudyPlan,
          //courseSelection: newCourseSelection,
          //accessToken: newAccessToken,
        })
        .expect(200)
        .then((res) => {
          //console.log(res.body);
          done();
        });
    });
  });
  //these tests bring the server to hang up :(

  /*describe("change user info fails", () => {
    test("send change request (duplicate name)", (done) => {
      request(url)
        .put("/users/" + "78623167")
        .send({
          username: username,
          email: "diff_email",
          password: password,
        })
        .expect(400)
        .then((res) => {
          assert(res.text, "Benutzername bereits vergeben!");
          done();
        });
    });
    test("send change request (duplicate email)", (done) => {
      request(url)
        .put("/users/" + "786078623167")
        .send({
          username: "diff_name",
          email: e_mail,
          password: password,
        })
        .expect(400)
        .then((res) => {
          assert(res.text, "Email bereits vergeben!");
          done();
        });
    });
  });*/
});
