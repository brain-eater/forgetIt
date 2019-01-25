const addTodoItem = function(req, res, todo, callback) {
  const listKey = req.url.match(/\/lists\/(.*)\/addItem/)[1];
  let list = todo.getList(listKey);
  list.items.push(req.body);
  callback();
  res.end();
};

module.exports = addTodoItem;
