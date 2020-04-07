const jwt = require('jsonwebtoken');

const secretKey = require('../secret');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).send({ message: 'Необходима авторизация' });
  } else {
    const token = authorization.replace('Bearer ', '');
    let payload;

    try {
      payload = jwt.verify(token, secretKey);
    } catch (err) {
      res.status(401).send({ message: 'Необходима авторизация' });
    }
    req.user = payload;
    next();
  }
};
