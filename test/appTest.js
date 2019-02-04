const request = require("supertest");
const app = require("../src/app");

describe("get request for /", function() {
  it("should return with status code 200", function(done) {
    request(app)
      .get("/")
      .expect(200)
      .end(done);
  });

  it("should return content type text/html", function(done) {
    request(app)
      .get("/")
      .expect("Content-Type", /text\/html/)
      .end(done);
  });

  it("should have quote about site", function(done) {
    request(app)
      .get("/")
      .expect(/I am sure I will ForgetIT./, done);
  });
});

describe("post request for /login", function() {
  it("should redirect ", function(done) {
    request(app)
      .post("/login")
      .send({ userName: "tilak", password: "123" })
      .expect(302)
      .end(done);
  });

  it("should redirect to /todos when username and passwordare correct", function(done) {
    request(app)
      .post("/login")
      .send({ userName: "tilak", password: "123" })
      .expect("location", "/todos")
      .end(done);
  });

  it("should not redirect when username and passwordare are not correct", function(done) {
    request(app)
      .post("/login")
      .send({ userName: "tilak", password: "1233" })
      .expect("Try again")
      .end(done);
  });
});

describe("post request for /newaccount", function() {
  it("should return 302", function(done) {
    request(app)
      .get("/newaccount")
      .expect(302)
      .end(done);
  });

  it("should return error when username/password is empty", function(done) {
    request(app)
      .post("/newaccount")
      .send({ userName: "", password: "" })
      .expect("Username/Password can't be EMPTY")
      .end(done);
  });

  it("should return error when username/password is same to privious", function(done) {
    request(app)
      .post("/newaccount")
      .send({ userName: "tilak", password: "pqr" })
      .expect("Username already exists")
      .end(done);
  });

  it("should redirect to /todos when userName and password are valid ", function(done) {
    request(app)
      .post("/newaccount")
      .send({ userName: new Date().getTime(), password: "123" })
      .expect("location", "/todos")
      .expect(302)
      .end(done);
  });
});
