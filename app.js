const { PORT = 3000 } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const {
  celebrate,
  Joi,
  errors,
} = require('celebrate');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');
const { login, postUser } = require('./contollers/users');
const auth = require('./middlewares/auth');

const app = express();
const NotFoundError = require('./errors/not-found-error');
const { isUrl } = require('./isurl/isurl');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signin', celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required()
        .min(8),
    }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required()
        .min(8),
      name: Joi.string()
        .min(2)
        .max(30),
      about: Joi.string()
        .min(2)
        .max(30),
      avatar: Joi.string()
        .custom(isUrl),
    }),
}), postUser);

app.use(auth);
app.use(routerUser);
app.use(routerCard);

app.use((req, res, next) => {
  next(new NotFoundError('Ресурс не найден'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
