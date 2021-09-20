const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const { JWT_SECRET } = require('../utils/config');

const auth = (req, res, next) => {
  if (!req.cookies.jwt) {
    next(new UnauthorizedError('Авторизация не прошла.'));
  } else {
    const token = req.cookies.jwt;
    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      next(new UnauthorizedError('JWT авторизация не прошла.'));
    }

    req.user = payload;

    next();
  }
};

module.exports = auth;
