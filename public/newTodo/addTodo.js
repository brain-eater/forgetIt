const getValue = function(document, name) {
  return document.getElementsByName(name)[0].value;
};

const postListDetails = function() {
  const title = getValue(document, "title");
  const description = getValue(document, "description");
  const listDetails = { title, description };
  fetch("/newTodo", {
    method: "POST",
    body: JSON.stringify(listDetails)
  })
    .then(res => res.text())
    .then(key => window.open(`/todos/${key}`, "_self"));
};
