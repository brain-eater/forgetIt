const Express = require("./express");
const app = new Express();
const fileHandler = require("./fileHandler");
const fs = require("fs");
const Todo = require("./todoLists");
const addTodoItem = require("./todoItemsHandler");

const todoListPath = "/todoItems/todoItems.html";
const allListPath = "/todoLists/todoLists.html";
const dataFilePath = "./data/todoLists.json";

let todo; //global object

const logRequest = function(req, res, next) {
  console.log(req.url);
  next();
};

const readPostedData = function(req, res, next) {
  let data = "";
  req.on("data", chunk => (data += chunk));
  req.on("end", () => {
    req.body = data;
    next();
  });
};

const updateData = function(fs) {
  const json = JSON.stringify(todo.getLists());
  console.log(todo.getLists());

  fs.writeFile(dataFilePath, json, err => {
    if (err) {
      console.log(err);
    }
  });
};

const createNewList = function(req, res, todo, fs) {
  const list = JSON.parse(req.body);
  list.items = [];
  const listNo = todo.addList(list);
  updateData(fs);
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

const loadData = function(fs) {
  let data;
  try {
    data = fs.readFileSync(dataFilePath, "utf-8");
  } catch (err) {
    data = "{}";
    fs.writeFileSync(dataFilePath, data);
  }
  return JSON.parse(data);
};

const existingLists = loadData(fs);
todo = new Todo(existingLists);

app.use(readPostedData);
app.use(logRequest);
app.post("/newList", (req, res) => createNewList(req, res, todo, fs));
app.get("/todoLists", (req, res) => getTodoLists(req, res, todo));
app.get(/\/lists\/.*\.json/, (req, res) => getTodoItems(req, res, todo));
app.post(/\/lists\/.*\/addItem/, (req, res) =>
  addTodoItem(req, res, todo, updateData.bind(null, fs))
);
app.get(/\/lists\/.*/, (req, res) => fileHandler(req, res, fs, todoListPath));
app.get(/\/lists/, (req, res) => fileHandler(req, res, fs, allListPath));
app.use((req, res) => fileHandler(req, res, fs));

module.exports = app.handleRequest.bind(app);
