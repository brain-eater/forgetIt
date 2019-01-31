const {
  ROOT,
  HOME_PAGE,
  USERS_LOGIN_DETAILS_PATH,
  USERS_TODO_DATA_PATH
} = require("./constants");
const Todos = require("./todoLists");
const fs = require("fs");

const fileHandler = function(req, res, next, requestedUrl) {
  const url = requestedUrl || req.url;
  const filePath = getFilePath(url);
  console.log(filePath);

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

const loadUserLoginData = function() {
  let data;
  try {
    data = fs.readFileSync(USERS_LOGIN_DETAILS_PATH, "utf-8");
  } catch (err) {
    data = "[]";
    fs.writeFileSync(USERS_LOGIN_DETAILS_PATH, data);
  }
  return JSON.parse(data);
};

const loadUserData = function() {
  let data;
  try {
    data = fs.readFileSync(USERS_TODO_DATA_PATH, "utf-8");
  } catch (err) {
    data = "{}";
    fs.writeFileSync(USERS_TODO_DATA_PATH, data);
  }
  return JSON.parse(data);
};

const getUserTodos = function() {
  let userDataObj = loadUserData();
  let userTodos = {};
  for (let userId in userDataObj) {
    let todos = new Todos(userDataObj[userId]);
    userTodos[userId] = todos;
  }
  return userTodos;
};

const updateUserData = function(loginDetails) {
  data = fs.writeFile(
    USERS_LOGIN_DETAILS_PATH,
    JSON.stringify(loginDetails),
    () => {}
  );
};

module.exports = {
  fileHandler,
  readPostedData,
  getUserTodos,
  loadUserLoginData,
  updateUserData
};
