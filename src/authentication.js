const { getUniqueNum } = require("./utils");
const Todos = require("./todoLists");
const fs = require("fs");
const { updateUserData } = require("./fileHandler");
const { createLoginCookie } = require("./cookie");

const updateActiveUsers = function({ userId, userName }, activeUsers) {
  const existingAuthKeys = Object.keys(activeUsers);
  const auth_key = getUniqueNum(3, existingAuthKeys);
  fs.readFile(`./data/${userId}.json`, "utf8", (err, data) => {
    const todos = new Todos(JSON.parse(data));
    let userDetails = { id: userId, userName, todos };
    activeUsers[auth_key] = userDetails;
  });

  return auth_key;
};

const logoutUser = function(res) {
  let cookie = createLoginCookie(null);
  res.setHeader("Set-cookie", cookie);
  res.redirect("/");
};

const loginUser = (userInfo, activeUsers, res) => {
  const auth_key = updateActiveUsers(userInfo, activeUsers);
  let cookie = createLoginCookie(auth_key);
  res.setHeader("Set-cookie", cookie);
  res.redirect("/todos");
};

const userNameHandler = function(req, res) {
  res.send(req.currUser.userName);
};

const createAccount = function(users, loginDetails) {
  let probableId = users.addUser(loginDetails);
  let msg = "";
  if (isNaN(probableId)) {
    msg = probableId;
    return msg;
  }
  fs.writeFile(`./data/${probableId}.json`, "[]", err => {
    console.log(err);
  });
  updateUserData(users.loginDetails);
  return "success";
};

module.exports = { userNameHandler, loginUser, logoutUser, createAccount };
