const { getUniqueNum, convertToNum } = require("./utils");

class Todo {
  constructor(lists) {
    this.lists = lists;
  }

  addTodo(list) {
    const listIds = convertToNum(Object.keys(this.lists));
    let key = getUniqueNum(4, listIds);
    this.lists[key] = list;
    return key;
  }

  getTodo(key) {
    return this.lists[key];
  }

  getTodos() {
    return this.lists;
  }
}

module.exports = Todo;
