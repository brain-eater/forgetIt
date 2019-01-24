const { getFs, getRes } = require("./mockers");
const assert = require("chai").assert;
const fileHandler = require("../src/fileHandler");

describe("fileHandler", function() {
  let fs, res;
  beforeEach(() => {
    fs = getFs();
    res = getRes();
  });

  it("should send the content of home page  using response when '/' is given as url", function() {
    const req = { url: "/" };
    fs.files["./public/index.html"] = "homepage";
    fileHandler(fs, req, res);
    assert.equal(res.output, "homepage");
  });

  it("should send specified file data through res.send ", function() {
    fs.files["./public/a.html"] = "something";
    const req = { url: "/a.html" };
    fileHandler(fs, req, res);
    assert.equal(res.output, "something");
  });

  it("should send not found through response when non-existing file name is given", function() {
    const req = { url: "/a.html" };
    fileHandler(fs, req, res);
    assert.equal(res.output, "file not found");
  });
});
