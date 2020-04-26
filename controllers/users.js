const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user.js');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');


const { NODE_ENV, JWT_SECRET } = process.env;

const { ObjectId } = mongoose.Types;

module.exports.getUsers = (req, res, next) => {
  userModel.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

module.exports.findUser = (req, res, next) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).send({ message: 'Невалидный id' });
    return;
  }
  userModel.findById({ _id: id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.status(200).send({ data: user });
    })
    .catch(next);
};


module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      name, about, avatar, email, password: hash,
    }))

    .then((user) => res.status(201).send({
      _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
    }))
    .catch((err) => ((err.name === 'ValidationError') ? new BadRequestError('Ошибка валидации') : next(err)));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 604800,
        httpOnly: true,
        sameSite: true,
        secure: true,
      });
      res.send({ token });
    })
    .catch(next);
};
