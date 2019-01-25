const addTodoItem = function(req, res, todoLists, callback) {
  const listTitle = req.url.match(/\/lists\/(.*)\/addItem/)[1];
  let requestList = todoLists.filter(list => list.title == listTitle)[0];
  requestList.items.push(req.body);
  callback();
  res.end();
};

module.exports = { addTodoItem };
