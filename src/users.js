const isSameUser = (user1, user2) =>
  user1.userName == user2.userName && user1.password == user2.password;

class Users {
  constructor(userList) {
    this.list = userList;
  }

  getUser(userId) {
    return this.list[userId];
  }

  getUserId(user) {
    return Object.keys(this.list).filter(existingUserId =>
      isSameUser(this.list[existingUserId], user)
    )[0];
  }

  addUser(user) {
    this.list.push(user);
  }
}

module.exports = Users;
