const decrementId = function(todo) {
  todo.id--;
  return todo;
};

class Todos {
  constructor(todos) {
    this.todos = todos;
  }

  addTodo(todo) {
    todo.id = this.todos.length + 1;
    this.todos.push(todo);
    return todo.id;
  }

  updateTodo(todo) {
    this.todos[todo.id - 1] = todo;
  }

  getTodo(id) {
    return this.todos[id - 1];
  }

  removeTodo(id) {
    let beforePart = this.todos.slice(0, id - 1);
    let afterPart = this.todos.slice(id);
    afterPart = afterPart.map(decrementId);
    this.todos = beforePart.concat(afterPart);
  }

  get() {
    return this.todos;
  }
}

module.exports = Todos;
