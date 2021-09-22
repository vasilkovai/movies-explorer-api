const router = require('express').Router();
const {
  login,
  createUser,
  signOut,
} = require('../controllers/users');
const { validateSignIn, validateSignUp } = require('../middlewares/validator');

router.post('/signin', validateSignIn, login);
router.post('/signup', validateSignUp, createUser);
router.delete('/signout', signOut);

module.exports = router;
