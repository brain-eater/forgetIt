const Express = require("./express");
const app = new Express();
const fileHandler = require("./fileHandler");
const fs = require("fs");
const { addTodoItem, getTodoItems } = require("./todoItemsHandler");

let todoItems = []; //Global variable

const logRequest = function(req, res, next) {
  console.log(req.url);
  next();
};

const readCookies = function(req, res, next) {
  const cookie = req.headers["cookie"];
  let cookies = {};
  if (cookie) {
    cookie.split(";").forEach(element => {
      let [name, value] = element.split("=");
      name = name.trim();
      cookies[name] = value;
    });
  }
  req.cookies = cookies;

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

const createNewList = function(req, res, fs) {
  const list = JSON.parse(req.body);
  list.items = [];
  fs.writeFile(`./data/${list.title}`, JSON.stringify(list), err => {
    res.setHeader("Set-Cookie", `currentListName=${list.title}`);
    res.send("/todoItems/todoItems.html");
  });
};

const getListDetails = function(req, res, fs) {
  const { currentListName } = req.cookies;
  fs.readFile(`./data/${currentListName}`, "utf8", function(err, data) {
    res.send(data);
  });
};

app.use(readCookies);
app.use(readPostedData);
app.use(logRequest);
app.post("/newList", (req, res) => createNewList(req, res, fs));
app.get("/loadTodoItems", (req, res) => getTodoItems(req, res, fs));
app.get("/loadListDetails", (req, res) => getListDetails(req, res, fs));
app.get("/loadTodoLists", (req, res) => getTodoItems(req, res, todoItems));
app.post("/addTodoItem", (req, res) => addTodoItem(req, res, fs));
app.use(fileHandler.bind(null, fs));

module.exports = app.handleRequest.bind(app);
