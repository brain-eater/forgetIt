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
      showTodoItems(data);
    });
};

const showTodoItems = function(todoItems) {
  let todoItemsDiv = document.getElementById("todoItems");
  todoItemsDiv.innerHTML = "";
  let listElement = document.createElement("ul");
  todoItems.forEach(todoItem => {
    let liElement = document.createElement("li");
    liElement.innerText = todoItem;
    listElement.appendChild(liElement);
  });
  todoItemsDiv.appendChild(listElement);
};

window.onload = loadTodoItems;
