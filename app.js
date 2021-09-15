const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { login, createUser, signOut } = require('./controllers/users');
const { validateSignIn, validateSignUp } = require('./middlewares/validator');
const auth = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const NotFoundError = require('./errors/not-found-err');
const error = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(helmet());

app.use(cookieParser());

app.use(requestLogger);

app.post('/signin', validateSignIn, login);
app.post('/signup', validateSignUp, createUser);
app.delete('/signout', signOut);

app.use(auth);

app.use('/users', usersRouter);
app.use('/movies', moviesRouter);

app.use('/*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден.');
});

app.use(errorLogger);

app.use(errors());
app.use(error);

app.listen(3000);
