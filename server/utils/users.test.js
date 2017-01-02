const expect = require('expect');

const {Users} = require('./users.js');

describe('Users', () => {
  beforeEach(() => {
    usersInstance = new Users();
    usersInstance.users = [
      {
        id: '1',
        name: 'Tester 1',
        room: 'Test Room'
      },
      {
        id: '2',
        name: 'Tester 2',
        room: 'Test Room 2'
      },
      {
        id: '3',
        name: 'Tester 3',
        room: 'Test Room'
      }
    ];
  });

  it('should add new user', () => {
    var usersInstance = new Users();
    var user = {
      id: '123',
      name: 'Tester',
      room: 'Test Room'
    };
    var resUser = usersInstance.addUser(user.id, user.name, user.room);

    //remember use .toEqual for arrays and objects instead of toBe
    expect(usersInstance.users).toEqual([user]);
  });

  it('should return names for Test Room', () => {
    var userList = usersInstance.getUserList('Test Room');
    expect(userList).toEqual(['Tester 1', 'Tester 3']);
  });

  it('should return names for Test Room 2', () => {
    var userList = usersInstance.getUserList('Test Room 2');
    expect(userList).toEqual(['Tester 2']);
  });

  it('should remove a user', () => {
    var userId = '1';
    var user = usersInstance.removeUser(userId);
    expect(user.id).toBe(userId);
    expect(usersInstance.users.length).toBe(2);
  });

  it('should not remove user', () => {
    var userId = '99';
    var user = usersInstance.removeUser(userId);
    expect(user).toNotExist();
    expect(usersInstance.users.length).toBe(3);
  });

  it('should find user', () => {
    var userId = '1';
    var user = usersInstance.getUser('1');
    expect(user.id).toBe('1');
  });

  it('should not find user', () => {
    var userId = 'bad id';
    var user = usersInstance.getUser(userId);
    expect(user).toNotExist();
  });
});
