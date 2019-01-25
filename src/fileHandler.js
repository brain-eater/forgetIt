const ROOT = "./public";
const HOME_PAGE = "/index.html";
const dataFilePath = "./data/todoLists.json";
const userDataFilePath = "./data/users.json";

const fileHandler = function(req, res, fs, requestedUrl) {
  const url = requestedUrl || req.url;
  const filePath = getFilePath(url);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.send("file not found", 404);
      return 1;
    }
    res.send(data);
  });
};

const getFilePath = function(url) {
  if (url == "/") url = HOME_PAGE;
  return ROOT + url;
};

const readPostedData = function(req, res, next) {
  let data = "";
  req.on("data", chunk => (data += chunk));
  req.on("end", () => {
    req.body = data;
    next();
  });
};

const updateData = function(fs, todo) {
  const json = JSON.stringify(todo.getLists());
  fs.writeFile(dataFilePath, json, err => {
    if (err) {
      console.log(err);
    }
  });
};

const loadListsData = function(fs) {
  let data;
  try {
    data = fs.readFileSync(dataFilePath, "utf-8");
  } catch (err) {
    data = "{}";
    fs.writeFileSync(dataFilePath, data);
  }
  return data;
};

const loadUserData = function(fs) {
  let data;
  try {
    data = fs.readFileSync(userDataFilePath, "utf-8");
  } catch (err) {
    data = "[]";
    fs.writeFileSync(userDataFilePath, data);
  }
  return data;
};

const loadData = function(fs) {
  let listDataJson = loadListsData(fs);
  let userDataJson = loadUserData(fs);
  let listData = JSON.parse(listDataJson);
  let userData = JSON.parse(userDataJson);
  return { listData, userData };
};

module.exports = { fileHandler, readPostedData, updateData, loadData };
