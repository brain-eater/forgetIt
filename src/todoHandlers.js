const fs = require("fs");

const getTodoKey = url => url.match(/\/lists\/(.*)\/addItem/)[1];
const getListKey = url => url.match(/\/lists\/(.*)\.json/)[1];

const updateUserFile = function(userId, todos) {
  fs.writeFile(`./data/${userId}.json`, JSON.stringify(todos), err => {
    if (err) console.log(err);
  });
};

const deleteTodo = function(req, res) {
  const todoKey = req.url.match(/\/lists\/del\/(.*)/)[1];
  let { id, todos } = req.currUser;
  const currUserTodos = todos.get();
  currUserTodos[todoKey] = undefined;
  updateUserFile(id, currUserTodos);
};

const addTodoItem = function(req, res, activeUsers) {
  const todoKey = getTodoKey(req.url);
  const { id, todos } = req.currUser;
  const todo = todos.getTodo(todoKey);
  const item = req.body;
  todo.items.push(item);
  updateUserFile(id, todos.get());
  res.end();
};

const createNewTodo = function(req, res) {
  const todo = JSON.parse(req.body);
  todo.items = [];
  let { id, todos } = req.currUser;
  const todoNo = todos.addTodo(todo);
  updateUserFile(id, todos.get());
  res.send(todoNo.toString());
};

const getTodos = function(req, res) {
  const { todos } = req.currUser;
  res.sendJson(todos.get());
};

const getTodoItems = function(req, res) {
  const todoKey = getListKey(req.url);
  const { todos } = req.currUser;
  const todo = todos.getTodo(todoKey);
  res.sendJson(todo);
};

module.exports = {
  addTodoItem,
  createNewTodo,
  getTodoItems,
  getTodos,
  deleteTodo
};
