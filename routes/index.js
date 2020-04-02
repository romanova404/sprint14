const router = require('express').Router();

const cards = require('./cards.js');
const users = require('./users.js');

router.use(users);
router.use(cards);
router.all('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});


module.exports = router;
