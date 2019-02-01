let todo;
const REDO_UNC = "&#x21aa;";
const TICK_UNC = "&#x2713;";
const PENCIL_UNC = "&#x270E;";
const TICK_CHAR_CODE = 10003;

const getPendingDiv = document => document.getElementById("pending");
const getCompletedDiv = document => document.getElementById("completed");

const loadTodo = function() {
  const url = window.location.href;
  fetch(url + ".json")
    .then(res => res.json())
    .then(data => {
      todo = new Todo(data);
      displayTodo();
    });
};

const displayTodo = function() {
  let titleEle = document.getElementById("title");
  let descriptionEle = document.getElementById("todoDescription");
  titleEle.innerText = todo.title;
  descriptionEle.innerText = todo.description;
  showTodoItems(todo.items);
};

const getParentDivs = function(document) {
  let pendingDiv = getPendingDiv(document);
  let completedDiv = getCompletedDiv(document);
  return {
    pending: pendingDiv,
    completed: completedDiv
  };
};

const addItemToDiv = (parentDivs, { todoItemDiv, parentDivId }) => {
  parentDivs[parentDivId].appendChild(todoItemDiv);
};

const showTodoItems = function(todoItems) {
  const parentDivs = getParentDivs(document);
  parentDivs.pending.innerHTML = "";
  parentDivs.completed.innerHTML = "";
  let todoItemDivs = todoItems.map(generateTodoItemDiv).reverse();
  todoItemDivs.forEach(addItemToDiv.bind(null, parentDivs));
};

const prepend = function(childDiv, parenetDiv) {
  let newDiv = document.createElement("div");
  newDiv.appendChild(childDiv);
  for (let child of parenetDiv.children) {
    newDiv.appendChild(child);
  }
  return newDiv;
};

const take = function(inputElementName) {
  const inputElement = document.getElementsByName(inputElementName)[0];
  const text = inputElement.value;
  inputElement.value = "";
  return text;
};

const addTodoItem = function() {
  let text = take("todoItemText");
  let pendingDiv = getPendingDiv(document);
  let todoItem = todo.addItem(text);
  let { todoItemDiv } = generateTodoItemDiv(todoItem);
  pendingDiv = prepend(todoItemDiv, pendingDiv);
  showTodoItems(todo.items);
  enableSaveBtn();
};

const createBtn = function(id, classList, onclick = "", innerHTML = "") {
  let buttonEle = document.createElement("button");
  buttonEle.onclick = onclick;
  classList.forEach(className => buttonEle.classList.add(className));
  buttonEle.innerHTML = innerHTML;
  buttonEle.id = id;
  return buttonEle;
};

const createItemButtons = function({ id, done }) {
  let doneBtnText = done ? REDO_UNC : TICK_UNC;
  let doneBtn = createBtn(id, ["roundBtn", "doneBtn"], toggle, doneBtnText);
  let delBtn = createBtn(id, ["delBtn", "roundBtn"], deleteItem);
  let editBtn = createBtn(id, ["editBtn", "roundBtn"], editItem, PENCIL_UNC);
  return [doneBtn, delBtn, editBtn];
};

const getParaElement = function(text) {
  let paraElement = document.createElement("p");
  paraElement.innerText = text;
  return paraElement;
};

const generateTodoItemDiv = function(todoItem) {
  let todoItemDiv = document.createElement("div");
  todoItemDiv.id = todoItem.id;
  let todoItemPara = getParaElement(todoItem.text);
  let parentDivId = todoItem.done ? "completed" : "pending";
  let buttons = createItemButtons(todoItem, todoItem.id);
  let children = [todoItemPara].concat(buttons);
  children.forEach(child => todoItemDiv.appendChild(child));
  return { todoItemDiv, parentDivId };
};

const save = function() {
  setSaveBtnStatus("saving");
  const reqHeader = {
    method: "POST",
    body: JSON.stringify(todo.data)
  };
  fetch("/saveTodo", reqHeader).then(() => {
    setSaveBtnStatus("Saved");
    setTimeout(() => {
      setSaveBtnStatus("Save Changes");
    }, 1000);
    disableSaveBtn();
  });
};

const setSaveBtnStatus = function(status) {
  const saveBtn = document.getElementById("saveBtn");
  saveBtn.innerText = status;
};

const setSaveBtn = function(enabled) {
  let saveBtn = document.getElementById("saveBtn");
  saveBtn.disabled = !enabled;
};

const enableSaveBtn = setSaveBtn.bind(null, true);
const disableSaveBtn = setSaveBtn.bind(null, false);

const toggle = function() {
  let toggleBtn = event.target;
  const itemId = toggleBtn.closest("div").id;
  todo.toggleStatus(itemId);
  let prevTextCode = toggleBtn.innerText.charCodeAt();
  toggleBtn.innerHTML = prevTextCode == TICK_CHAR_CODE ? REDO_UNC : TICK_UNC;
  showTodoItems(todo.items);
  enableSaveBtn();
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
  textBox.focus();
};

const loadUserName = function() {
  fetch("/username")
    .then(res => res.text())
    .then(username => {
      let usernameEle = document.getElementById("username");
      usernameEle.innerText = username;
    });
};

const updateItem = function(id) {
  let key = event.key;
  let textBox = event.target;
  if (key == "Enter") {
    let editedItem = textBox.value;
    todo.editItem(id, editedItem);
    const todoDiv = textBox.closest("div");
    const itemPara = getParaElement(editedItem);
    todoDiv.replaceChild(itemPara, textBox);
    enableSaveBtn();
  }
};

const deleteItem = function() {
  const clickedBtn = event.target;
  const itemId = clickedBtn.closest("div").id;
  todo.removeItem(itemId);
  showTodoItems(todo.items);
  enableSaveBtn();
};

const intialize = function() {
  const todoItemTextBox = document.getElementsByName("todoItemText")[0];
  todoItemTextBox.onkeydown = () => {
    if (event.key == "Enter") addTodoItem();
  };
  loadTodo();
  loadUserName();
};

window.onload = intialize;
