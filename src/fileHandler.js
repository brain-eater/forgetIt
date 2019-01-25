const ROOT = "./public";
const HOME_PAGE = "/index.html";
const dataFilePath = "./data/todoLists.json";

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

const loadData = function(fs) {
  let data;
  try {
    data = fs.readFileSync(dataFilePath, "utf-8");
  } catch (err) {
    data = "{}";
    fs.writeFileSync(dataFilePath, data);
  }
  return JSON.parse(data);
};

module.exports = { fileHandler, readPostedData, updateData, loadData };
