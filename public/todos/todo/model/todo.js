class Todo {
  constructor(todoData) {
    this.todo = todoData;
  }
  get title() {
    return this.todo.title;
  }

  get description() {
    return this.todo.description;
  }

  get id() {
    return this.todo.id;
  }

  get data() {
    return this.todo;
  }

  get items() {
    return this.todo.items;
  }

  addItem(text) {
    const id = this.todo.items.length + 1;
    let todoItem = { id, text, done: false };
    this.todo.items.push(todoItem);
    return todoItem;
  }

  toggleStatus(itemId) {
    let itemIndex = itemId - 1;
    let prevStatus = this.todo.items[itemIndex].done;
    this.todo.items[itemIndex].done = !prevStatus;
  }

  decrementId(todoItem) {
    todoItem.id--;
    return todoItem;
  }

  removeItem(itemId) {
    let beforePart = this.todo.items.slice(0, itemId - 1);
    let afterPart = this.todo.items.slice(itemId);
    afterPart = afterPart.map(this.decrementId);
    this.todo.items = beforePart.concat(afterPart);
  }

  editItem(itemId, newText) {
    this.todo.items[itemId - 1].text = newText;
  }
}
