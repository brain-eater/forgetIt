const { getUniqueNum } = require("./utils");

const isSameUserName = (userName1, userName2) => userName1 == userName2;
const isEmpty = text => text === "";

const duplicateUserMsg = "Username already exists";
const EmptyFieldMsg = "Username/Password can't be EMPTY";

const isSameUser = (user1, user2) =>
  isSameUserName(user1.userName, user2.userName) &&
  user1.password == user2.password;

class Users {
  constructor(userList) {
    this.list = userList;
  }

  get loginDetails() {
    return this.list;
  }

  getUserName(userId) {
    return this.list[userId].userName;
  }

  getUser(userId) {
    return this.list[userId];
  }

  getUserId(user) {
    return Object.keys(this.list).filter(existingUserId =>
      isSameUser(this.list[existingUserId], user)
    )[0];
  }

  validate({ userName, password }) {
    const allUserNames = Object.keys(this.list).map(
      this.getUserName.bind(this)
    );
    if (isEmpty(userName) || isEmpty(password)) {
      return EmptyFieldMsg;
    }
    if (allUserNames.includes(userName)) {
      return duplicateUserMsg;
    }

    return "valid";
  }

  addUser(loginDetails) {
    const validationReport = this.validate(loginDetails);
    if (validationReport != "valid") {
      return validationReport;
    }
    let uniqueId = getUniqueNum(3, Object.keys(this.list));
    this.list[uniqueId] = loginDetails;
    return uniqueId;
  }
}

module.exports = Users;
