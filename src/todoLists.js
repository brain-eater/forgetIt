const { getUniqueNum, convertToNum } = require("./utils");

class Todos {
  constructor(todos) {
    this.todos = todos;
  }

  addTodo(list) {
    const listIds = convertToNum(Object.keys(this.todos));
    let key = getUniqueNum(4, listIds);
    this.todos[key] = list;
    return key;
  }

  getTodo(key) {
    return this.todos[key];
  }

  get() {
    return this.todos;
  }
}

module.exports = Todos;
