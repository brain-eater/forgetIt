const getRes = () => {
  return {
    output: "",
    send: function(data) {
      this.output = data;
    }
  };
};

const getFs = () => {
  return {
    files: {},
    writeFile: function(filePath, data, callback) {
      this.files[filePath] = data;
      callback();
    },
    readFileSync: function(filePath, encoding) {
      return this.files[filePath];
    },
    readFile: function(filePath, encoding, callBack) {
      if (this.files[filePath]) {
        callBack(null, this.files[filePath]);
        return 0;
      }
      callBack("not found");
    }
  };
};

module.exports = { getFs, getRes };
