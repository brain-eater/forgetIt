const Express = require("./express");
const app = new Express();
const fileHandler = require("./fileHandler");
const fs = require("fs");
const { addTodoItem } = require("./todoItemsHandler");

const todoListPath = "/todoItems/todoItems.html";
const allListPath = "/todoLists/todoLists.html";
let todoLists = []; //GlobalVariable

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

const writeToDataFile = function(fs) {
  fs.writeFile(`./data/todoLists.json`, JSON.stringify(todoLists), err => {
    if (err) {
      console.log(err);
    }
  });
};

const createNewList = function(req, res, fs) {
  const list = JSON.parse(req.body);
  list.items = [];
  todoLists.push(list);
  writeToDataFile(fs);
  res.end();
};

const getTodoLists = function(req, res, fs) {
  res.sendJson(todoLists);
};

const getTodoItems = function(req, res, fs) {
  const listTitle = req.url.match(/\/lists\/(.*)\.json/)[1];
  let requestList = todoLists.filter(list => list.title == listTitle)[0];
  res.sendJson(requestList);
};

const loadData = function(fs) {
  let data = fs.readFileSync("./data/todoLists.json", "utf-8");
  todoLists = JSON.parse(data);
};

loadData(fs);
const writeToDataFileWithFs = writeToDataFile.bind(null, fs);

app.use(readPostedData);
app.use(logRequest);
app.post("/newList", (req, res) => createNewList(req, res, fs));
app.get("/todoLists", (req, res) => getTodoLists(req, res, fs));
app.get(/\/lists\/.*\.json/, (req, res) => getTodoItems(req, res, fs));
app.post(/\/lists\/.*\/addItem/, (req, res) =>
  addTodoItem(req, res, todoLists, writeToDataFileWithFs)
);
app.get(/\/lists\/.*/, (req, res) => fileHandler(req, res, fs, todoListPath));
app.get(/\/lists/, (req, res) => fileHandler(req, res, fs, allListPath));
app.use((req, res) => fileHandler(req, res, fs));

module.exports = app.handleRequest.bind(app);
