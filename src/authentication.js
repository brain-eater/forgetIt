const { getUniqueNum } = require("./utils");
const Todos = require("./todoLists");
const fs = require("fs");
const { updateUserData } = require("./fileHandler");
const { createLoginCookie } = require("./cookie");

const updateActiveUsers = function(id, activeUsers) {
  const existingAuthKeys = Object.keys(activeUsers);
  const auth_key = getUniqueNum(3, existingAuthKeys);
  fs.readFile(`./data/${id}.json`, "utf8", (err, data) => {
    const todos = new Todos(JSON.parse(data));
    let userDetails = { id, todos };
    activeUsers[auth_key] = userDetails;
  });

  return auth_key;
};

const logoutUser = function(res) {
  let cookie = createLoginCookie(null);
  res.setHeader("Set-cookie", cookie);
  res.redirect("/");
};

const loginUser = (userId, activeUsers, res) => {
  const auth_key = updateActiveUsers(userId, activeUsers);
  let cookie = createLoginCookie(auth_key);
  res.setHeader("Set-cookie", cookie);
  res.redirect("/todos");
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

module.exports = { loginUser, logoutUser, createAccount };
