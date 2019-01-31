const Express = require("./express");
const app = new Express();
const fs = require("fs");
const {
  fileHandler,
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
const { cookieHandler } = require("./cookie");
const {
  userNameHandler,
  loginUser,
  createAccount,
  logoutUser
} = require("./authentication");
const { TODO_PAGE_PATH, ALL_TODOS_PAGE_PATH } = require("./constants");

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

const homepageHandler = function(req, res) {
  const { auth_key } = req.cookies;
  if (activeUsers[auth_key]) {
    res.redirect("/todos");
    return;
  }
  fileHandler(req, res);
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
  let responseMsg = createAccount(users, newUser, userTodos);
  updateUsersTodoFile(userTodos);
  res.send(responseMsg);
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

const getAllTodosPage = (req, res, next) =>
  fileHandler(req, res, next, ALL_TODOS_PAGE_PATH);
const getSpecificTodoPage = (req, res, next) =>
  fileHandler(req, res, next, TODO_PAGE_PATH);

app.use(cookieHandler);
app.use(readPostedData);
app.use(logRequest);
app.get("/", homepageHandler);
app.get("/style.css", fileHandler);
app.get("/login.js", fileHandler);
app.get("/signup.html", fileHandler);
app.get("/signup.js", fileHandler);
app.get("/logo.png", fileHandler);
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
app.get(/\/todos\/.*/, getSpecificTodoPage);
app.get("/todos", getAllTodosPage);
app.use(fileHandler);

module.exports = app.handleRequest.bind(app);
