const loadTodoLists = function() {
  fetch("/todoLists")
    .then(res => res.json())
    .then(lists => showLists(lists));
};

const createElemets = function() {
  let todoDiv = document.createElement("div");
  let titleHeading = document.createElement("h2");
  titleHeading.className = "heading";
  let descriptionPara = document.createElement("p");
  let editLink = document.createElement("a");
  editLink.id = "edit";
  let delBtn = document.createElement("button");
  delBtn.innerText = "Delete";
  delBtn.id = "del";
  return { todoDiv, titleHeading, descriptionPara, editLink, delBtn };
};

const createTodoDiv = function(key, { title, description }) {
  const {
    todoDiv,
    titleHeading,
    descriptionPara,
    editLink,
    delBtn
  } = createElemets();
  todoDiv.id = key;
  editLink.href = `/lists/${key}`;
  editLink.innerHTML = "<button >Edit</button>";
  delBtn.onclick = deleteTodo;
  titleHeading.innerText = title;
  descriptionPara.innerText = description;
  const childDivs = [titleHeading, descriptionPara, editLink, delBtn];
  childDivs.forEach(append.bind(null, todoDiv));
  return todoDiv;
};

const showLists = function(lists) {
  let mainDiv = document.getElementById("todoLists");
  const todoDivs = Object.keys(lists).map(key =>
    createTodoDiv(key, lists[key])
  );
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
  const mainDiv = todoDiv.parentElement;
  mainDiv.removeChild(todoDiv);
  fetch(`/lists/del/${todoId}`);
};

const intialize = function() {
  loadTodoLists();
};

window.onload = intialize;
