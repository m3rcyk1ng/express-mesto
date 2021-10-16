const { PORT = 3000 } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '616b046b5265dfce109b5777',
  };
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(routerUser);
app.use(routerCard);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
