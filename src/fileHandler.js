const ROOT = "./public";
const HOME_PAGE = "/index.html";

const fileHandler = function(fs, req, res) {
  const filePath = getFilePath(req.url);
  console.log(filePath);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.send("file not found", 404);
      return 1;
    }
    res.send(data);
  });
};

const getFilePath = function(url) {
  if (url == "/") {
    url = HOME_PAGE;
  }
  return ROOT + url;
};

module.exports = fileHandler;
