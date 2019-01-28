const updateTodoList = function() {
  let titleEle = document.getElementById("title");
  let descriptionEle = document.getElementById("listDescription");
  const url = window.location.href;
  fetch(url + ".json")
    .then(res => res.json())
    .then(({ title, description, items }) => {
      console.log(items);
      console.log("here");

      titleEle.innerText = title;
      descriptionEle.innerText = description;
      showTodoItems(items);
    });
};

const addTodoItem = function() {
  console.log("there");

  const todoItemTextBox = document.getElementsByName("todoItem")[0];
  const body = todoItemTextBox.value;
  todoItemTextBox.value = "";
  const url = window.location.href;
  fetch(url + "/addItem", {
    method: "POST",
    body
  }).then(() => updateTodoList());
};

const loadList = function() {
  const url = window.location.href;
  fetch(url + ".json")
    .then(res => res.json())
    .then(data => {
      updateTodoList(data);
    });
};

const createListItem = function(todoItem, listElement, document) {
  let liElement = document.createElement("li");
  liElement.innerText = todoItem;
  listElement.appendChild(liElement);
};

const showTodoItems = function(todoItems) {
  let todoItemsDiv = document.getElementById("todoItems");
  todoItemsDiv.innerHTML = "";
  let listElement = document.createElement("ul");
  todoItems.forEach(todoItem => {
    createListItem(todoItem, listElement, document);
  });
  todoItemsDiv.appendChild(listElement);
};

const intialize = function() {
  updateTodoList();
};

window.onload = intialize;
