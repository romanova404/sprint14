const cardRouter = require('express').Router();

const { getCards, createCard, deleteCard } = require('../controllers/cards');
const { createCardCheck } = require('../modules/validation.js');

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', createCardCheck, createCard);
cardRouter.delete('/cards/:cardId', deleteCard);


module.exports = cardRouter;
