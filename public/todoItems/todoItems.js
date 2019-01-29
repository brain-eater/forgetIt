let todo;
const REFRESH_UNICODE = "&#x21bb;";
const TICK_UNICODE = "&#x2713;";

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

const loadTodo = function() {
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
  let text = todoItem.done ? REFRESH_UNICODE : TICK_UNICODE;
  doneBtn.onclick = toggle;
  doneBtn.className = "roundBtn";
  doneBtn.innerHTML = text;
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
      saveButton.innerText = "Save Changes";
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
  let prevTextCode = toggleBtn.innerText.charCodeAt();
  toggleBtn.innerHTML = prevTextCode == 10003 ? REFRESH_UNICODE : TICK_UNICODE;
  enableSaveBtn();
};

const intialize = function() {
  loadTodo();
};

window.onload = intialize;
