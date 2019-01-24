const addTodoItem = function(req, res, todoItems, fs) {
  todoItems.push(req.body);
  fs.writeFile("./data/todoItems.json", JSON.stringify(todoItems), err =>
    res.send("")
  );
};

const getTodoItems = function(req, res, todoItems) {
  res.send(JSON.stringify(todoItems));
};

const loadTodoItems = function(fs) {
  todoItems = fs.readFileSync("./data/todoItems.json");
  return JSON.parse(todoItems);
};

module.exports = { addTodoItem, getTodoItems, loadTodoItems };
