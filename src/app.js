const Express = require("./express");
const app = new Express();
const fileHandler = require("./fileHandler");
const fs = require("fs");
const {
  addTodoItem,
  getTodoItems,
  loadTodoItems
} = require("./todoItemsHandler");

let todoItems = []; //Global variable

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

todoItems = loadTodoItems(fs);

app.use(readPostedData);
app.use(logRequest);
app.get("/loadTodoItems", (req, res) => getTodoItems(req, res, todoItems));
app.post("/addTodoItem", (req, res) => addTodoItem(req, res, todoItems, fs));
app.use(fileHandler.bind(null, fs));

module.exports = app.handleRequest.bind(app);
