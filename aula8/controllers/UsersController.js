const UserModel = require('../models/User');

class UsersController {

  index = async (req, res, next) => {
    const users = await UserModel.all();
    res.json(users);
  }

  create = async (req, res, next) => {
    try {
      const data = await this._validateData(req.body);
      const user = await UserModel.create(data);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  show = async (req, res, next) => {
    const user = await UserModel.find(req.params.userId);
    res.json(user);
  }

  update = async (req, res, next) => {
    try {
      const id = req.params.userId;
      const data = await this._validateData(req.body, id);
      const user = await UserModel.update(data, id);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  delete = async (req, res, next) => {
    await UserModel.delete(req.params.userId);
    res.json({});
  }

  _validateData = async (data, id) => {
    const attributes = ['name', 'age', 'sex', 'email'];
    const user = {};
    for (const attribute of attributes) {
      if (! data[attribute]){
        throw new Error(`The attribute "${attribute}" is required.`);
      }
      user[attribute] = data[attribute];
    }

    if (await this._checkIfEmailExists(user.email, id)) {
      throw new Error(`The user with mail address "${user.email}" already exists.`);
    }

    return user;
  }

  _checkIfEmailExists = async (email, id) => {
    const users = await UserModel.all();
    const user = users.find((user) => user.email === email && user.id !== Number(id));

    return Boolean(user);
  }

}

module.exports = new UsersController();
