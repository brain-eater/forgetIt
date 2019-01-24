const postListDetails = function() {
  const title = document.getElementsByName("title")[0].value;
  const description = document.getElementsByName("description")[0].value;
  const listDetails = { title, description };
  fetch("/newList", {
    method: "POST",
    body: JSON.stringify(listDetails)
  })
    .then(res => res.text())
    .then(url => window.open(url, "_self"));
};
