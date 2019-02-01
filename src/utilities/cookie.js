const parseCookies = function(cookieHeader) {
  const cookies = cookieHeader.split(";");
  let cookiesObj = cookies.reduce(generateCookieObj, {});
  return cookiesObj;
};

const generateCookieObj = (cookiesObj, cookie) => {
  let [name, value] = cookie.split("=");
  name = name.trim();
  cookiesObj[name] = value;
  return cookiesObj;
};

const cookieHandler = function(req, res, next) {
  const cookieHeader = req.headers["cookie"];
  if (cookieHeader) {
    req.cookies = parseCookies(cookieHeader);
    next();
    return;
  }
  req.cookies = { auth_key: null };
  next();
};

const createLoginCookie = function(auth_key) {
  let cookie = `auth_key=${auth_key} `;
  return cookie;
};

module.exports = { cookieHandler, createLoginCookie };
