const router = require('express').Router();
const {
  celebrate,
  Joi,
} = require('celebrate');

const { findUsers, findUserId, updateProfileInfo, updateProfileAvatar, findUser } = require('../contollers/users');
const { isUrl } = require('../isurl/isurl');

router.get('/users', findUsers);
router.get('/users/me', findUser);

router.get('/users/:userId', celebrate({
  // валидируем параметры
  params: Joi.object()
    .keys({
      userId: Joi.string()
        .required()
        .length(24)
        .hex(),
    }),
}), findUserId);

router.patch('/users/me', celebrate({
  // валидируем параметры
  body: Joi.object()
    .keys({
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
      about: Joi.string()
        .required()
        .min(2)
        .max(30),
    }),
}), updateProfileInfo);

router.patch('/users/me/avatar', celebrate({
  // валидируем параметры
  body: Joi.object()
    .keys({
      avatar: Joi.string()
        .required()
        .custom(isUrl),
    }),
}), updateProfileAvatar);

module.exports = router;
