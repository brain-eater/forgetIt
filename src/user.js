class Users {
  constructor(userList) {
    this.list = userList;
  }

  getUser(username) {
    return this.list.filter(user => user.userName == username)[0];
  }

  isUserPresent(user) {
    return (
      this.list.filter(
        existingUser =>
          existingUser.userName == user.userName &&
          existingUser.password == user.password
      ).length > 0
    );
  }

  addUser(user) {
    this.list.push(user);
  }
}

module.exports = Users;
