const Card = require('../models/card');

const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;
const ERROR_CODE_500 = 500;

module.exports.findCards = (req, res) => {
  Card.find({})
    .then((user) => res.status(200).send({ data: user }))
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'На сервере произошла ошибка [error: ERROR_CODE_500]' }));
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_400).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      }
      res.status(ERROR_CODE_500).send({ message: 'На сервере произошла ошибка [error: ERROR_CODE_500]' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      } else {
        res.status(ERROR_CODE_404).send({ message: 'Карточка с указанным _id не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_400).send({
          message: 'Передан невалидный id',
        });
      }
      res.status(ERROR_CODE_500).send({ message: 'На сервере произошла ошибка [error: ERROR_CODE_500]' });
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      } else {
        res.status(ERROR_CODE_404).send({
          message: 'Передан несуществующий _id карточки',
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_400).send({
          message: 'Переданы некорректные данные для снятия лайка',
        });
      }
      res.status(ERROR_CODE_500).send({ message: 'На сервере произошла ошибка [error: ERROR_CODE_500]' });
    });
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      } else {
        res.status(ERROR_CODE_404).send({
          message: 'Передан несуществующий _id карточки',
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_400).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
      }
      res.status(ERROR_CODE_500).send({ message: 'На сервере произошла ошибка [error: ERROR_CODE_500]' });
    });
};
