const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const routes = require('./routes');
const { createUser, login } = require('./controllers/users');
const { createUserCheck, loginCheck } = require('./modules/validation');

const auth = require('./middlewares/auth');


const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(cookieParser());

app.post('/signin', loginCheck, login);
app.post('/signup', createUserCheck, createUser);

app.use(auth);
app.use(routes);

app.use(errors());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
