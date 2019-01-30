const { ROOT, HOME_PAGE, USERS_LOGIN_DETAILS_PATH } = require("./constants");
const fs = require("fs");

const fileHandler = function(req, res, next, requestedUrl) {
  const url = requestedUrl || req.url;
  const filePath = getFilePath(url);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.send("file not found", 404);
      return 1;
    }
    res.send(data);
  });
};

const getFilePath = function(url) {
  if (url == "/") url = HOME_PAGE;
  return ROOT + url;
};

const readPostedData = function(req, res, next) {
  let data = "";
  req.on("data", chunk => (data += chunk));
  req.on("end", () => {
    req.body = data;
    next();
  });
};

const loadUserData = function() {
  let data;
  try {
    data = fs.readFileSync(USERS_LOGIN_DETAILS_PATH, "utf-8");
  } catch (err) {
    data = "[]";
    fs.writeFileSync(userDataFilePath, data);
  }
  return JSON.parse(data);
};

module.exports = {
  fileHandler,
  readPostedData,
  loadUserData
};
