const fs = require("fs");

const getTodoKey = url => url.match(/\/lists\/(.*)\/addItem/)[1];
const getListKey = url => url.match(/\/lists\/(.*)\.json/)[1];

const updateUserFile = function(userId, todos) {
  fs.writeFile(`./data/${userId}.json`, JSON.stringify(todos), err => {
    if (err) console.log(err);
  });
};

const addTodoItem = function(req, res, activeUsers) {
  const { auth_key } = req.cookies;
  const listKey = getTodoKey(req.url);
  const { id, todos } = activeUsers[auth_key];
  const todo = todos.getTodo(listKey);
  const item = req.body;
  todo.items.push(item);
  updateUserFile(id, todos.getTodos());
  res.end();
};

const createNewTodo = function(req, res, activeUsers) {
  const todo = JSON.parse(req.body);
  todo.items = [];
  const { auth_key } = req.cookies;
  let { id, todos } = activeUsers[auth_key];
  const todoNo = todos.addTodo(todo);
  updateUserFile(id, todos.getTodos());
  res.send(todoNo.toString());
};

const getTodos = function(req, res, activeUsers) {
  const { auth_key } = req.cookies;
  const { todos } = activeUsers[auth_key];
  res.sendJson(todos.getTodos());
};

const getTodoItems = function(req, res, activeUsers) {
  const { auth_key } = req.cookies;
  const listKey = getListKey(req.url);
  const { todos } = activeUsers[auth_key];
  const list = todos.getTodo(listKey);
  res.sendJson(list);
};

module.exports = { addTodoItem, createNewTodo, getTodoItems, getTodos };
