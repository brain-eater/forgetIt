const postUserDetails = function() {
  const userName = document.getElementsByName("uname")[0].value;
  const password = document.getElementsByName("pwd")[0].value;
  const status = document.getElementById("status");
  status.hidden = false;
  const userDetails = { userName, password };

  fetch("/login", {
    method: "POST",
    contentType: "application/json",
    body: JSON.stringify(userDetails)
  })
    .then(res => res.text())
    .then(msg => (status.innerText = msg));
};
