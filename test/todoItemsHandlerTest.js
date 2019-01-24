const {
  addTodoItem,
  getTodoItems,
  loadTodoItems
} = require("../src/todoItemsHandler.js");
const { getFs, getRes } = require("./mockers");
const assert = require("chai").assert;

describe("addTodoItem", function() {
  let fs, res, todoItems, req;

  before(function() {
    fs = getFs();
    fs.files["./data/todoItems.json"] = "";
    res = getRes();
    todoItems = ["do nothing"];
    req = { body: "new todo item" };
    addTodoItem(req, res, todoItems, fs);
  });

  it("should push to todoItems", function() {
    assert.deepEqual(todoItems, ["do nothing", "new todo item"]);
  });

  it("should write to the file", function() {
    const fileData = fs.files["./data/todoItems.json"];
    assert.deepEqual(fileData, '["do nothing","new todo item"]');
  });
});

describe("getTodoItems", function() {
  let res, todoItems, req;

  before(function() {
    res = getRes();
    todoItems = ["do nothing"];
    getTodoItems(req, res, todoItems);
  });

  it("should return todoitems using res.send", function() {
    assert.equal(res.output, '["do nothing"]');
  });
});

describe("loadTodoItems", function() {
  let fs = getFs();
  fs.files["./data/todoItems.json"] = '["do nothing"]';

  it("should return statement", function() {});
  assert.deepEqual(loadTodoItems(fs), ["do nothing"]);
});
