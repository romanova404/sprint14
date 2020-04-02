const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user.js');

const { ObjectId } = mongoose.Types;

module.exports.getUsers = (req, res) => {
  userModel.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.findUser = (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).send({ message: 'Невалидный id' });
    return;
  }
  userModel.findById({ _id: id })
    .then((user) => (user ? res.status(200).send({ data: user }) : res.status(404).send({ message: 'Нет пользователя с таким id' })))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};


module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      name, about, avatar, email, password: hash,
    }))

    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => ((err.name === 'ValidationError') ? res.status(400).send({ message: 'Ошибка валидации' }) : res.status(500).send({ message: 'Произошла ошибка' })));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'temporary-word', { expiresIn: '7d' });
      res.send({ token });
      res.cookie('jwt', token, {
        maxAge: '7d',
        httpOnly: true,
      })
        .end();
    })
    .catch(() => res.status(401).send({ message: 'Ошибка авторизации' }));
};
