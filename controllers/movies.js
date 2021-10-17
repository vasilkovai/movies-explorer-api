const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const ErrorMessage = require('../utils/messages');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.status(200).send({ data: movie }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(200).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ErrorMessage.BAD_REQUEST));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)
    .orFail(new Error('Error'))
    .then((movie) => {
      if (req.user._id !== movie.owner.toString()) {
        return next(new ForbiddenError(ErrorMessage.FORBIDDEN));
      }
      return Movie.deleteOne(movie)
        .then(() => res.status(200).send({ message: 'Карточка удалена.' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(ErrorMessage.BAD_REQUEST));
      } else if (err.message === 'Error') {
        next(new NotFoundError(ErrorMessage.NOT_FOUND));
      } else {
        next(err);
      }
    });
};
