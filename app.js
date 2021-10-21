const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { MONGO_URL } = require('./utils/config');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { limiter } = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const error = require('./middlewares/error');
const ErrorMessage = require('./utils/messages');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const options = {
  origin: [
    'http://localhost:3000',
    'https://cinemaholic.diploma.nomoredomains.monster',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization', 'Accept'],
  credentials: true,
};

app.use('*', cors(options));

app.use(helmet());

app.use(cookieParser());

app.use(requestLogger);

app.use(require('./routes/index'));

app.use(auth);

app.use(require('./routes/movies'));
app.use(require('./routes/users'));

app.use('/*', () => {
  throw new NotFoundError(ErrorMessage.NOT_FOUND);
});

app.use(errorLogger);

app.use(limiter);

app.use(errors());
app.use(error);

app.listen(3000);
