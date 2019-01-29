const loadTodos = function() {
  fetch("/todos.json")
    .then(res => res.json())
    .then(todos => showTodos(todos));
};

const createElemets = function() {
  let todoDiv = document.createElement("div");
  let titleHeading = document.createElement("h2");
  titleHeading.className = "heading";
  let descriptionPara = document.createElement("p");
  let editLink = document.createElement("a");
  editLink.id = "edit";
  let delBtn = document.createElement("button");
  delBtn.innerHTML = "&#x2716;";
  delBtn.className = "roundBtn";
  delBtn.id = "del";
  return { todoDiv, titleHeading, descriptionPara, editLink, delBtn };
};

const createTodoDiv = function({ id, title, description }) {
  const {
    todoDiv,
    titleHeading,
    descriptionPara,
    editLink,
    delBtn
  } = createElemets();
  todoDiv.id = id;
  editLink.href = `/todos/${id}`;
  editLink.innerHTML = "<button>Edit</button>";
  delBtn.onclick = deleteTodo;
  titleHeading.innerText = title;
  descriptionPara.innerText = description;
  const childDivs = [titleHeading, descriptionPara, editLink, delBtn];
  childDivs.forEach(append.bind(null, todoDiv));
  return todoDiv;
};

const showTodos = function(todos) {
  let mainDiv = document.getElementById("allTodos");
  mainDiv.innerHTML = "";
  const todoDivs = todos.map(todo => createTodoDiv(todo));
  todoDivs.forEach(div => {
    mainDiv.appendChild(div);
  });
};

const append = function(mainDiv, childDiv) {
  mainDiv.appendChild(childDiv);
};

const deleteTodo = function() {
  const clickedBtn = event.target;
  const todoDiv = clickedBtn.closest("div");
  const todoId = todoDiv.id;
  fetch(`/todos/del/${todoId}`).then(() => {
    loadTodos();
  });
};

const intialize = function() {
  loadTodos();
};

window.onload = intialize;
