const mongoose = require('mongoose');

const cardModel = require('../models/card.js');

const { ObjectId } = mongoose.Types;

module.exports.getCards = (req, res) => {
  cardModel.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  cardModel.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => ((err.name === 'ValidationError') ? res.status(400).send({ message: 'Ошибка валидации' }) : res.status(500).send({ message: 'Произошла ошибка' })));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  if (!ObjectId.isValid(cardId)) {
    res.status(400).send({ message: 'Невалидный id' });
    return;
  }
  cardModel.findById(cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Нет карточки с таким id' });
      } else if (card.owner.toString() !== req.user._id) {
        res.status(401).send({ message: 'Невозможно удалить чужую карточку' });
      } else {
        cardModel.findByIdAndRemove(cardId)
          .then(() => res.status(200).send({ data: card }))
          .catch(() => res.status(500).send({ message: 'Что-то пошло не так' }));
      }
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
