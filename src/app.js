const Express = require("./express");
const app = new Express();
const { fileHandler, readPostedData, loadUserData } = require("./fileHandler");
const {
  addTodoItem,
  createNewTodo,
  getTodoItems,
  getTodos
} = require("./todoHandlers");
const Users = require("./users");
const { cookieHandler } = require("./cookie");
const { loginUser, logoutUser } = require("./authentication");
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
    res.redirect("/lists");
    return;
  }
  fileHandler(req, res);
};

const logoutHandler = (req, res) => {
  const { auth_key } = req.cookies;
  activeUsers[auth_key] = undefined;
  logoutUser(auth_key, res);
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
  next();
};

// initialize
const userData = loadUserData();
users = new Users(userData);

const getAllTodosPage = (req, res, next) =>
  fileHandler(req, res, next, ALL_TODOS_PAGE_PATH);
const getSpecificTodoPage = (req, res, next) =>
  fileHandler(req, res, next, TODO_PAGE_PATH);
const newTodoHandler = (req, res) => createNewTodo(req, res, activeUsers);
const todosHandler = (req, res) => getTodos(req, res, activeUsers);
const todoItemsHandler = (req, res) => getTodoItems(req, res, activeUsers);
const newTodoItemHandler = (req, res) => addTodoItem(req, res, activeUsers);

app.use(cookieHandler);
app.use(readPostedData);
app.use(logRequest);
app.get("/", homepageHandler);
app.get("/style.css", fileHandler);
app.get("/login.js", fileHandler);
app.post("/login", loginHandler);
app.use(isUserActive);
app.get("/logout", logoutHandler);
app.post("/newList", newTodoHandler);
app.get("/todoLists", todosHandler);
app.get(/\/lists\/.*\.json/, todoItemsHandler);
app.post(/\/lists\/.*\/addItem/, newTodoItemHandler);
app.get(/\/lists\/.*/, getSpecificTodoPage);
app.get(/\/lists/, getAllTodosPage);
app.use(fileHandler);

module.exports = app.handleRequest.bind(app);
