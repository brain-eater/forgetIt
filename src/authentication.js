const { getUniqueNum } = require("./utils");
const Todo = require("./todoLists");
const fs = require("fs");
const { createLoginCookie } = require("./cookie");

const updateActiveUsers = function(id, activeUsers) {
  const existingAuthKeys = Object.keys(activeUsers);
  const auth_key = getUniqueNum(3, existingAuthKeys);
  fs.readFile(`./data/${id}.json`, "utf8", (err, data) => {
    const todos = new Todo(JSON.parse(data));
    let userDetails = { id, todos };
    activeUsers[auth_key] = userDetails;
  });

  return auth_key;
};

const logoutUser = function(auth_key, res) {
  let cookie = createLoginCookie(null);
  res.setHeader("Set-cookie", cookie);
  res.redirect("/");
};

const loginUser = (userId, activeUsers, res) => {
  const auth_key = updateActiveUsers(userId, activeUsers);
  let cookie = createLoginCookie(auth_key);
  res.setHeader("Set-cookie", cookie);
  res.redirect("/lists");
};

module.exports = { loginUser, logoutUser };
