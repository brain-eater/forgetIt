const { getUniqueNum } = require("./utilities/utils");

const Todos = require("./todoLists");
const { updateUserData } = require("./fileHandler");
const { createLoginCookie } = require("./utilities/cookie");

const updateActiveUsers = function(userDetails, activeUsers, userTodos) {
  let { userId, userName } = userDetails;
  const existingAuthKeys = Object.keys(activeUsers);
  const auth_key = getUniqueNum(3, existingAuthKeys);
  let todos = userTodos[userId];
  let userData = { id: userId, userName, todos };
  activeUsers[auth_key] = userData;
  return auth_key;
};

const logoutUser = function(res) {
  let cookie = createLoginCookie(null);
  res.setHeader("Set-cookie", cookie);
  res.redirect("/");
};

const loginUser = (userInfo, activeUsers, userTodos, res) => {
  const auth_key = updateActiveUsers(userInfo, activeUsers, userTodos);
  let cookie = createLoginCookie(auth_key);
  res.setHeader("Set-cookie", cookie);
  res.redirect("/todos");
};

const userNameHandler = function(req, res) {
  res.send(req.currUser.userName);
};

const createAccount = function(users, loginDetails, userTodos) {
  let { id, msg } = users.addUser(loginDetails);
  if (msg != "success") {
    return msg;
  }
  userTodos[id] = new Todos([]);
  updateUserData(users.loginDetails);
  return msg;
};

module.exports = { userNameHandler, loginUser, logoutUser, createAccount };
