const loadTodoLists = function() {
  fetch("/todoLists")
    .then(res => res.json())
    .then(lists => showLists(lists));
};

const createElemets = function() {
  let listDiv = document.createElement("div");
  let titleHeading = document.createElement("h2");
  let descriptionPara = document.createElement("p");
  let link = document.createElement("a");
  return { listDiv, titleHeading, descriptionPara, link };
};

const createListDiv = function({ title, description }) {
  const { listDiv, titleHeading, descriptionPara, link } = createElemets();
  link.href = `/lists/${title}`;
  link.innerHTML = "<button>open List</button>";
  titleHeading.innerText = title;
  descriptionPara.innerText = description;
  const childDivs = [titleHeading, descriptionPara, link];
  childDivs.forEach(append.bind(null, listDiv));
  return listDiv;
};

const showLists = function(lists) {
  let mainDiv = document.getElementById("todoLists");
  const listDivs = lists.map(createListDiv);
  listDivs.forEach(div => {
    mainDiv.appendChild(div);
  });
};

const append = function(mainDiv, childDiv) {
  mainDiv.appendChild(childDiv);
};

window.onload = loadTodoLists;
