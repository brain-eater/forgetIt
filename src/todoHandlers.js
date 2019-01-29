const fs = require("fs");

const getTodoKey = url => url.match(/\/lists\/(.*)\.json/)[1];

const updateUserFile = function(userId, todos) {
  fs.writeFile(`./data/${userId}.json`, JSON.stringify(todos), err => {
    if (err) console.log(err);
  });
};

const deleteTodo = function(req, res) {
  const todoId = req.url.match(/\/lists\/del\/(.*)/)[1];
  let { id, todos } = req.currUser;
  todos.removeTodo(todoId);
  updateUserFile(id, todos.get());
};

const updateTodo = function(req, res) {
  const { id, todos } = req.currUser;
  const todo = JSON.parse(req.body);
  todos.updateTodo(todo);
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
  const todoId = getTodoKey(req.url);
  const { todos } = req.currUser;
  const todo = todos.getTodo(todoId);
  res.sendJson(todo);
};

module.exports = {
  updateTodo,
  createNewTodo,
  getTodoItems,
  getTodos,
  deleteTodo
};
