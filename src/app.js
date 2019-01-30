const Express = require("./express");
const app = new Express();
const { fileHandler, readPostedData, loadUserData } = require("./fileHandler");
const {
  updateTodo,
  createNewTodo,
  getTodoItems,
  getTodos,
  deleteTodo
} = require("./todoHandlers");
const Users = require("./users");
const { cookieHandler } = require("./cookie");
const { loginUser, createAccount, logoutUser } = require("./authentication");
const { TODO_PAGE_PATH, ALL_TODOS_PAGE_PATH } = require("./constants");

let users; //global object
let activeUsers = {}; //global object

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
    loginUser(userId, activeUsers, res);
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
  let responseMsg = createAccount(users, JSON.parse(req.body));
  res.send(responseMsg);
};

// initialize
const userData = loadUserData();
users = new Users(userData);

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
app.post("/login", loginHandler);
app.post("/newaccount", newAccountHandler);
app.use(isUserActive);
app.get("/logout", logoutHandler);
app.post("/newTodo", createNewTodo);
app.get("/todos.json", getTodos);
app.get(/\/todos\/del\/.*/, deleteTodo);
app.get(/\/todos\/.*\.json/, getTodoItems);
app.post("/saveTodo", updateTodo);
app.get(/\/todos\/.*/, getSpecificTodoPage);
app.get("/todos", getAllTodosPage);
app.use(fileHandler);

module.exports = app.handleRequest.bind(app);
