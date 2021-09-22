const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    validate: {
      validator: (v) => isURL(v, { protocols: ['http', 'https', 'ftp'], require_tld: true, require_protocol: true }),
      message: 'Must be a Valid URL',
    },
    required: true,
  },
  trailer: {
    type: String,
    validate: {
      validator: (v) => isURL(v, { protocols: ['http', 'https', 'ftp'], require_tld: true, require_protocol: true }),
      message: 'Must be a Valid URL',
    },
    required: true,
  },
  thumbnail: {
    type: String,
    validate: {
      validator: (v) => isURL(v, { protocols: ['http', 'https', 'ftp'], require_tld: true, require_protocol: true }),
      message: 'Must be a Valid URL',
    },
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
