class Users {
  constructor () {
    this.users = [];
  }
  addUser (id, name, room) {
    var user = {id, name, room};
    this.users.push(user);
    return user;
  }
  removeUser (id) {
    var user = this.getUser(id);

    if (user) {
      this.users = this.users.filter((user) => {
        return user.id !== id;
      });
    }

    return user;
  }
  getUser (id) {
    var user = this.users.filter((user) => {
      return user.id === id;
    });
    return user[0];
  }
  getUserList (room) {
    var users = this.users.filter((user) => {
      return user.room === room;
    });
    var namesArray = users.map((user) => {
      return user.name;
    });
    return namesArray;
  }
}

module.exports = {
  Users
};

//Old method for removeUser with reduce, still valid but more complicated
// var removedUser;
//
// this.users = this.users.reduce((users, user, index) => {
//   if (user.id === id) {
//     removedUser = user;
//     return users;
//   } else {
//     users.push(user);
//     return users;
//   }
// }, []);
//
// return removedUser;

// //creating Person class
// class Person {
//   //constructor fn runs upon instantiation
//   constructor (name, age) {
//     this.name = name;
//     this.age = age;
//   }
//
//   //adding class methods
//   getUserDescription () {
//     return `${this.name} is ${this.age} years old.`;
//   }
// }
//
// //creating instance of class
// var me = new Person('Stephen', 26);
// var description = me.getUserDescription();
// console.log(description);
