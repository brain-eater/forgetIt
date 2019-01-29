let todo;

const displayTodo = function() {
  let titleEle = document.getElementById("title");
  let descriptionEle = document.getElementById("listDescription");
  titleEle.innerText = todo.title;
  descriptionEle.innerText = todo.description;
  showTodoItems(todo.items);
};

const addTodoItem = function() {
  const id = todo.items.length + 1;
  const todoItemTextBox = document.getElementsByName("todoItem")[0];
  const text = todoItemTextBox.value;
  todoItemTextBox.value = "";
  let todoItem = { id, text, done: false };
  todo.items.push(todoItem);
  let todoItemDiv = generateTodoItemDiv(todoItem);
  let todoItemsDiv = document.getElementById("todoItems");
  todoItemsDiv.appendChild(todoItemDiv);
  enableSaveBtn();
};

const loadList = function() {
  const url = window.location.href;
  fetch(url + ".json")
    .then(res => res.json())
    .then(data => {
      console.log(data);
      todo = data;
      displayTodo();
    });
};

const generateTodoItemDiv = function(todoItem) {
  let todoItemDiv = document.createElement("div");
  let todoItemText = document.createElement("p");
  todoItemText.innerText = todoItem.text;
  let doneBtn = document.createElement("button");
  let text = todoItem.done ? "UnDone" : "Done";
  doneBtn.onclick = toggle;
  doneBtn.innerText = text;
  doneBtn.id = todoItem.id;
  todoItemDiv.appendChild(todoItemText);
  todoItemDiv.appendChild(doneBtn);
  return todoItemDiv;
};

const showTodoItems = function(todoItems) {
  let todoItemsDiv = document.getElementById("todoItems");
  todoItemsDiv.className = "flexContainer";
  let todoItemDivs = todoItems.map(generateTodoItemDiv);
  todoItemDivs.forEach(div => {
    todoItemsDiv.appendChild(div);
  });
};

const save = function() {
  let saveButton = event.target;
  saveButton.innerText = "saving";
  fetch("/saveTodo", {
    method: "POST",
    body: JSON.stringify(todo)
  }).then(() => {
    saveButton.innerText = "Saved";
    setTimeout(() => {
      saveButton.innerText = "Save";
    }, 1000);
    disableSaveBtn();
  });
};

const setSaveBtn = function(enabled) {
  let saveBtn = document.getElementById("saveBtn");
  saveBtn.disabled = !enabled;
};

const enableSaveBtn = setSaveBtn.bind(null, true);
const disableSaveBtn = setSaveBtn.bind(null, false);

const toggle = function() {
  let toggleBtn = event.target;
  const itemId = toggleBtn.id - 1;
  let prevStatus = todo.items[itemId].done;
  todo.items[itemId].done = !prevStatus;
  let prevText = toggleBtn.innerText;
  toggleBtn.innerText = prevText == "Done" ? "UnDone" : "Done";
  enableSaveBtn();
};

const intialize = function() {
  loadList();
};

window.onload = intialize;
