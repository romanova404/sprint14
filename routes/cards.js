const cardRouter = require('express').Router();

const { getCards, createCard, deleteCard } = require('../controllers/cards');
const { createCardCheck, cardIdCheck } = require('../modules/validation.js');

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', createCardCheck, createCard);
cardRouter.delete('/cards/:cardId', cardIdCheck, deleteCard);


module.exports = cardRouter;
