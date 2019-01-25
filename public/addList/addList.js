const getValue = function(document, name) {
  return document.getElementsByName(name)[0].value;
};

const postListDetails = function() {
  const title = getValue(document, "title");
  const description = getValue(document, "description");
  const listDetails = { title, description };
  fetch("/newList", {
    method: "POST",
    body: JSON.stringify(listDetails)
  }).then(res => window.open(`/lists/${title}`, "_self"));
};
