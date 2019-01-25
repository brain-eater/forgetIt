const Express = require("./express");
const app = new Express();
const {
  fileHandler,
  readPostedData,
  updateData,
  loadData
} = require("./fileHandler");
const fs = require("fs");
const Todo = require("./todoLists");
const addTodoItem = require("./todoItemsHandler");

const todoListPath = "/todoItems/todoItems.html";
const allListPath = "/todoLists/todoLists.html";

let todo; //global object

const logRequest = function(req, res, next) {
  console.log(req.url);
  next();
};

const createNewList = function(req, res, todo, fs) {
  const list = JSON.parse(req.body);
  list.items = [];
  const listNo = todo.addList(list);
  updateData(fs, todo);
  res.send(listNo.toString());
};

const getTodoLists = function(req, res, todo) {
  res.sendJson(todo.getLists());
};

const getTodoItems = function(req, res, todo) {
  const listKey = req.url.match(/\/lists\/(.*)\.json/)[1];
  const list = todo.getList(listKey);
  res.sendJson(list);
};

const existingLists = loadData(fs);
todo = new Todo(existingLists);

app.use(readPostedData);
app.use(logRequest);
app.post("/newList", (req, res) => createNewList(req, res, todo, fs));
app.get("/todoLists", (req, res) => getTodoLists(req, res, todo));
app.get(/\/lists\/.*\.json/, (req, res) => getTodoItems(req, res, todo));
app.post(/\/lists\/.*\/addItem/, (req, res) =>
  addTodoItem(req, res, todo, updateData.bind(null, fs, todo))
);
app.get(/\/lists\/.*/, (req, res) => fileHandler(req, res, fs, todoListPath));
app.get(/\/lists/, (req, res) => fileHandler(req, res, fs, allListPath));
app.use((req, res) => fileHandler(req, res, fs));

module.exports = app.handleRequest.bind(app);
