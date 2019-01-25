const readCookies = function(req, res, next) {
  const cookie = req.headers["cookie"];
  let cookies = {};
  if (cookie) {
    cookie.split(";").forEach(element => {
      let [name, value] = element.split("=");
      name = name.trim();
      cookies[name] = value;
    });
  }
  req.cookies = cookies;

  next();
};

const createCookie = function() {
  let cookie = new Date();
  return cookie.getTime();
};
