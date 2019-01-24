const addTodoItem = function() {
  const todoItem = document.getElementsByName("todoItem")[0].value;
  fetch("/addTodoItem", {
    method: "POST",
    body: todoItem
  }).then(() => loadTodoItems());
};

const loadTodoItems = function() {
  fetch("/loadTodoItems")
    .then(res => res.json())
    .then(data => {
      console.log(data);

      showTodoItems(data);
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

const loadListDetails = function() {
  let title = document.getElementById("title");
  let listDescription = document.getElementById("listDescription");
  fetch("/loadListDetails")
    .then(res => res.json())
    .then(listDetails => {
      title.innerText = listDetails.title;
      listDescription.innerText = listDetails.description;
    });
};

const intialize = function() {
  loadTodoItems();
  loadListDetails();
};

window.onload = intialize;
