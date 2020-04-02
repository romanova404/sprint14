const userRouter = require('express').Router();

const { getUsers, findUser } = require('../controllers/users.js');

userRouter.get('/users', getUsers);
userRouter.get('/users/:id', findUser);

module.exports = userRouter;
