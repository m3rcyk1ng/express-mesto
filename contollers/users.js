const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict-error');

module.exports.findUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

module.exports.findUserId = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      }
      throw new NotFoundError('Пользователь по данному ID не найден. Проверьте корректность введенных данных!');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан невалидный id'));
      }
      next(err);
    });
};

module.exports.findUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      }
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан невалидный id'));
      }
      next(err);
    });
};

module.exports.postUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then(() => res.status(200).send({ data: name, about, avatar, email, password }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.name === 'MongoServerError') {
        next(new ConflictError('Пользователь с таким e-mail уже существует'));
      }
      next(err);
    });
};

module.exports.updateProfileInfo = (req, res, next) => {
  // обновим имя найденного по _id пользователя
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } throw new NotFoundError('Пользователь с указанным _id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      next(err);
    });
};

module.exports.updateProfileAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Передан неверный логин или пароль');
      }
      return bcrypt.compare(password, user.password)

        // eslint-disable-next-line consistent-return
        .then((matched) => {
          if (!matched) {
            // хеши не совпали — отклоняем промис
            throw new UnauthorizedError('Передан неверный логин или пароль');
          }
          const token = jwt.sign(
            { _id: user._id },
            'some-secret-key',
            { expiresIn: '7d' },
          );
          // аутентификация успешна
          res.send({ token });
        })
        .catch(next);
    })
    .catch(next);
};
