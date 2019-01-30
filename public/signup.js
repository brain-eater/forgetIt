const getValue = function(name) {
  return document.getElementsByName(name)[0].value;
};

const createAccount = function() {
  const status = document.getElementById("status");
  const successMsg =
    "Account Created successfully.<br>Please  <a href='/'>Login</a>";
  const userName = getValue("uname");
  const password = getValue("pwd");
  const conformedPwd = getValue("pwd2");
  if (password === conformedPwd) {
    const userDetails = { userName, password };
    fetch("/newaccount", {
      method: "POST",
      body: JSON.stringify(userDetails)
    })
      .then(res => res.text())
      .then(msg => {
        status.classList.replace("success", "error");
        status.hidden = false;
        status.innerHTML = msg;
        if (msg === "success") {
          status.classList.replace("error", "success");
          status.innerHTML = successMsg;
        }
      });
  }
};
