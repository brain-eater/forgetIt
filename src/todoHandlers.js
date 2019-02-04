const getTodoKey = url => url.match(/\/todos\/(.*)\.json/)[1];

const deleteTodo = function(req, res) {
  const todoId = req.url.match(/\/todos\/del\/(.*)/)[1];
  let { id, todos } = req.currUser;
  todos.removeTodo(todoId);
  res.end();
};

const updateTodo = function(req, res) {
  const { id, todos } = req.currUser;
  const todo = JSON.parse(req.body);
  todos.updateTodo(todo);
  res.end();
};

const createNewTodo = function(req, res) {
  const todo = JSON.parse(req.body);
  todo.items = [];
  let { id, todos } = req.currUser;
  const todoNo = todos.addTodo(todo);
  res.send(todoNo.toString());
};

const getTodos = function(req, res) {
  const { todos } = req.currUser;

  res.json(todos.get());
};

const getTodoItems = function(req, res) {
  const todoId = getTodoKey(req.url);
  const { todos } = req.currUser;
  const todo = todos.getTodo(todoId);
  res.json(todo);
};

module.exports = {
  updateTodo,
  createNewTodo,
  getTodoItems,
  getTodos,
  deleteTodo
};
