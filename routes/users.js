const userRouter = require('express').Router();

const { getUsers, findUser } = require('../controllers/users.js');
const { userIdCheck } = require('../modules/validation');

userRouter.get('/users', getUsers);
userRouter.get('/users/:id', userIdCheck, findUser);

module.exports = userRouter;
