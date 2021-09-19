const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ErrorMessage = require('../utils/messages');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUserInfo = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError(ErrorMessage.NOT_FOUND));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  User.findOne({ email })
    .then((client) => {
      if (client) {
        throw next(new ConflictError(ErrorMessage.CONFLICT));
      } else {
        bcrypt
          .hash(password, 10)
          .then((hash) => User.create({
            name,
            email,
            password: hash,
          }))
          .then((user) => res.status(201).send(user.toJSON()))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new BadRequestError(ErrorMessage.BAD_REQUEST));
            } else if (err.name === 'MongoError' && err.code === 11000) {
              next(new ConflictError(ErrorMessage.CONFLICT));
            } else {
              next(err);
            }
          });
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, email }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .orFail(() => new Error('Error'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ErrorMessage.BAD_REQUEST));
      } else if (err.message === 'Error') {
        next(new NotFoundError(ErrorMessage.NOT_FOUND));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          httpOnly: true,
          sameSite: true,
        })
        .send({ token });
    })
    .catch(() => {
      throw next(new UnauthorizedError(ErrorMessage.UNAUTHORIZED));
    })
    .catch(next);
};

module.exports.signOut = (req, res, next) => {
  res.clearCookie('jwt').send(ErrorMessage.SUCCESS);
  next();
};
