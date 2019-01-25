const generateRandomNum = function() {
  const fourDigitFloat = Math.random() * 8999 + 1000;
  return Math.floor(fourDigitFloat);
};

const includes = function(obj, key) {
  return obj[key] != undefined;
};

class Todo {
  constructor(lists) {
    this.lists = lists;
  }
  addList(list) {
    let key;
    do {
      key = generateRandomNum();
    } while (includes(this.lists, key));
    console.log(key);

    this.lists[key] = list;
    return key;
  }

  getList(key) {
    return this.lists[key];
  }

  getLists() {
    return this.lists;
  }
}

module.exports = Todo;
