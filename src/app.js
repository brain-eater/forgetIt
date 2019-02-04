const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const {
  readPostedData,
  loadUserLoginData,
  getUserTodos
} = require("./fileHandler");
const {
  updateTodo,
  createNewTodo,
  getTodoItems,
  getTodos,
  deleteTodo
} = require("./todoHandlers");
const Users = require("./users");
const { cookieHandler } = require("./utilities/cookie");
const {
  userNameHandler,
  loginUser,
  createAccount,
  logoutUser
} = require("./authentication");
const {
  ROOT,
  HOME_PAGE_FILES,
  TODO_PAGE_PATH,
  ALL_TODOS_PAGE_PATH
} = require("./constants");

let users, userTodos; //global object
let activeUsers = {}; //global object

const updateUsersTodoFile = function(userTodos) {
  let userTodosData = {};
  for (let userId in userTodos) {
    userTodosData[userId] = userTodos[userId].get();
  }
  fs.writeFile(`./data/userTodos.json`, JSON.stringify(userTodosData), err => {
    if (err) console.log(err);
  });
};

const logRequest = function(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
};

const homepageHandler = function(req, res, next) {
  const { auth_key } = req.cookies;
  if (activeUsers[auth_key]) {
    res.redirect("/todos");
    return;
  }
  next();
};

const logoutHandler = (req, res) => {
  req.currUser = undefined;
  logoutUser(res);
};

const loginHandler = (req, res) => {
  let user = JSON.parse(req.body);
  const userId = users.getUserId(user);
  if (userId) {
    const userName = users.getUserName(userId);
    loginUser({ userId, userName }, activeUsers, userTodos, res);
    return;
  }
  res.send("Try again");
};

const isUserActive = function(req, res, next) {
  const { auth_key } = req.cookies;
  if (!activeUsers[auth_key]) {
    res.redirect("/");
    return;
  }
  req.currUser = activeUsers[auth_key];
  next();
};

const newAccountHandler = function(req, res) {
  let newUser = JSON.parse(req.body);
  let { msg, userId } = createAccount(users, newUser, userTodos);
  updateUsersTodoFile(userTodos);
  if (msg === "success") {
    let { userName } = newUser;
    let userInfo = { userId, userName };
    loginUser(userInfo, activeUsers, userTodos, res);
    return;
  }
  res.send(msg);
};

const newTodoHandler = function(req, res) {
  createNewTodo(req, res);
  updateUsersTodoFile(userTodos);
};

const deleteTodoHandler = function(req, res) {
  deleteTodo(req, res);
  updateUsersTodoFile(userTodos);
};

const updateTodoHandler = function(req, res) {
  updateTodo(req, res);
  updateUsersTodoFile(userTodos);
};
// initialize
const userLoginData = loadUserLoginData();
users = new Users(userLoginData);
userTodos = getUserTodos();

const getAllTodosPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../public", ALL_TODOS_PAGE_PATH));
};

const getSpecificTodoPage = (req, res, next) =>
  res.sendFile(path.join(__dirname, "../public", TODO_PAGE_PATH));

app.use(cookieHandler);
app.use(readPostedData);
app.use(logRequest);
app.get("/", homepageHandler);
app.use(express.static(HOME_PAGE_FILES));
app.post("/login", loginHandler);
app.post("/newaccount", newAccountHandler);
app.use(isUserActive);
app.get("/username", userNameHandler);
app.get("/logout", logoutHandler);
app.get("/todos.json", getTodos);
app.get(/\/todos\/.*\.json/, getTodoItems);
app.post("/newTodo", newTodoHandler);
app.get(/\/todos\/del\/.*/, deleteTodoHandler);
app.post("/saveTodo", updateTodoHandler);
app.get(/\/todos\/[0-9]+/, getSpecificTodoPage);
app.get("/todos", getAllTodosPage);
app.use(express.static(ROOT));

module.exports = app;
