const postUserDetails = function() {
  const userName = document.getElementsByName("uname")[0].value;
  const password = document.getElementsByName("pwd")[0].value;
  const status = document.getElementById("status");
  const msg = "Incorrect username or password.";
  const userDetails = { userName, password };

  fetch("/login", {
    method: "POST",
    contentType: "application/json",
    body: JSON.stringify(userDetails)
  }).then(res => {
    if (res.redirected) {
      window.open(res.url, "_self");
      return;
    }
    status.hidden = false;
    status.innerText = msg;
  });
};
