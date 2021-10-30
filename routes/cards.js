const router = require('express').Router();
const {
  celebrate,
  Joi,
} = require('celebrate');
const { findCards, postCard, deleteCard, putLike, deleteLike } = require('../contollers/cards');
const { isUrl } = require('../isurl/isurl');

router.get('/cards', findCards);

router.post('/cards', celebrate({
  // валидируем параметры
  body: Joi.object()
    .keys({
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
      link: Joi.string()
        .required()
        .custom(isUrl),
    }),
}), postCard);

router.delete('/cards/:cardId', celebrate({
  // валидируем параметры
  params: Joi.object()
    .keys({
      cardId: Joi.string()
        .required()
        .length(24)
        .hex(),
    }),
}), deleteCard);

router.delete('/cards/:cardId/likes', celebrate({
  // валидируем параметры
  params: Joi.object()
    .keys({
      cardId: Joi.string()
        .required()
        .length(24)
        .hex(),
    }),
}), deleteLike);

router.put('/cards/:cardId/likes', celebrate({
  // валидируем параметры
  params: Joi.object()
    .keys({
      cardId: Joi.string()
        .required()
        .length(24)
        .hex(),
    }),
}), putLike);

module.exports = router;
