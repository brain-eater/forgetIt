const MISMATCH_PWD_MSG = "Password mismatch.";

const getValue = function(name) {
  return document.getElementsByName(name)[0].value;
};

const createAccount = function() {
  const userName = getValue("uname");
  const password = getValue("pwd");
  const confirmedPwd = getValue("pwd2");
  if (password === confirmedPwd) {
    createAccountReq({ userName, password });
    return;
  }
  showStatus(MISMATCH_PWD_MSG);
};

function createAccountReq(userDetails) {
  fetch("/newaccount", {
    method: "POST",
    body: JSON.stringify(userDetails)
  })
    .then(res => {
      if (res.redirected) {
        window.open(res.url, "_self");
        return null;
      }
      return res.text();
    })
    .then(msg => {
      if (msg) showStatus(msg);
    });
}

const showStatus = function(msg) {
  const status = document.getElementById("status");
  status.hidden = false;
  status.innerHTML = msg;
};
