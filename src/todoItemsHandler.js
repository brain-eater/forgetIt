const addTodoItem = function(req, res, fs) {
  const { currentListName } = req.cookies;
  const listFilePath = `./data/${currentListName}`;
  let listJson = fs.readFileSync(listFilePath, "utf8");
  let list = JSON.parse(listJson);
  list.items.push(req.body);
  fs.writeFile(listFilePath, JSON.stringify(list), err => res.send(""));
};

const getTodoItems = function(req, res, fs) {
  const { currentListName } = req.cookies;
  todoItems = fs.readFile(`./data/${currentListName}`, "utf8", (err, data) => {
    let { items } = JSON.parse(data);
    res.send(JSON.stringify(items));
  });
};

module.exports = { addTodoItem, getTodoItems };
