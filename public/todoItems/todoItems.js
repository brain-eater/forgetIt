let todo;
const REFRESH_UNICODE = "&#x21bb;";
const TICK_UNICODE = "&#x2713;";
const PENCIL_UNICODE = "&#x270E;";

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

const createBtn = function(id, classList, onclick = "", innerHTML = "") {
  let buttonEle = document.createElement("button");
  buttonEle.onclick = onclick;
  classList.forEach(className => buttonEle.classList.add(className));
  buttonEle.innerHTML = innerHTML;
  buttonEle.id = id;
  return buttonEle;
};

const generateTodoItemDiv = function(todoItem) {
  let { id } = todoItem;
  let todoItemDiv = document.createElement("div");
  todoItemDiv.id = id;
  let todoItemText = document.createElement("p");
  todoItemText.innerText = todoItem.text;
  let text = todoItem.done ? REFRESH_UNICODE : TICK_UNICODE;
  let doneBtn = createBtn(id, ["roundBtn", "doneBtn"], toggle, text);
  let delBtn = createBtn(id, ["delBtn", "roundBtn"], deleteItem);
  let editBtn = createBtn(
    id,
    ["editBtn", "roundBtn"],
    editItem,
    PENCIL_UNICODE
  );
  let children = [todoItemText, doneBtn, delBtn, editBtn];
  children.forEach(child => todoItemDiv.appendChild(child));
  return todoItemDiv;
};

const showTodoItems = function(todoItems) {
  let todoItemsDiv = document.getElementById("todoItems");
  todoItemsDiv.innerHTML = "";
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

const removeItem = id => {
  let beforePart = todo.items.slice(0, id - 1);
  let afterPart = todo.items.slice(id);
  afterPart = afterPart.map(decrementId);
  todo.items = beforePart.concat(afterPart);
};

const decrementId = function(todo) {
  todo.id--;
  return todo;
};

const editItem = function() {
  const clickedBtn = event.target;
  const todoDiv = clickedBtn.closest("div");
  const itemId = todoDiv.id;
  const itemParaTag = todoDiv.children[0];
  const textBox = document.createElement("input");
  textBox.className = "edit";
  textBox.setAttribute("type", "text");
  textBox.setAttribute("value", itemParaTag.innerText);
  textBox.onkeydown = updateItem.bind(null, itemId);
  todoDiv.replaceChild(textBox, itemParaTag);
};

const updateItem = function(id) {
  let key = event.key;
  let textBox = event.target;
  if (key == "Enter") {
    let editedItem = textBox.value;
    todo.items[id - 1].text = editedItem;
    const todoDiv = textBox.closest("div");
    const itemPara = document.createElement("p");
    itemPara.innerText = editedItem;
    todoDiv.replaceChild(itemPara, textBox);
    enableSaveBtn();
  }
};

const deleteItem = function() {
  const clickedBtn = event.target;
  const todoDiv = clickedBtn.closest("div");
  const itemId = todoDiv.id;
  const parentDiv = todoDiv.parentNode;
  setTimeout(() => parentDiv.removeChild(todoDiv), 300);
  removeItem(itemId);
  showTodoItems(todo.items);
  enableSaveBtn();
};

const intialize = function() {
  loadTodo();
};

window.onload = intialize;
