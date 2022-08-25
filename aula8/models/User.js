const fs = require('fs');
const fsPromises = fs.promises;

const FILENAME = './users.json';

class User {

  static all = () => {
    return new Promise(async (resolve, reject) => {
      resolve(JSON.parse(await fsPromises.readFile(FILENAME, 'utf-8')));
    });
  }

  static find = (id) => {
    return new Promise(async (resolve, reject) => {
      const users = await this.all();
      const user = users.find((user) => user.id === Number(id));
      resolve(user);
    });
  }

  static create = (data) => {
    return new Promise(async (resolve, reject) => {
      const users = await this.all();
      const id = (users.length ? users[users.length - 1].id : 0) + 1;
      data.id = id;
      users.push(data);
      await fsPromises.writeFile(FILENAME, JSON.stringify(users));
      resolve(data);
    });
  }

  static update = (data, id) => {
    return new Promise(async (resolve, reject) => {
      id = Number(id);
      const users = await this.all();
      const index = users.findIndex((user) => user.id === id);
      data.id = id;
      users[index] = data;
      await fsPromises.writeFile(FILENAME, JSON.stringify(users));
      resolve(data);
    });
  }

  static delete = (id) => {
    return new Promise(async (resolve, reject) => {
      const users = await this.all();
      const index = users.findIndex((user) => user.id === Number(id));
      users.splice(index, 1);
      await fsPromises.writeFile(FILENAME, JSON.stringify(users));
      resolve();
    });
  }

}

module.exports = User;
