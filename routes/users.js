const router = require('express').Router();
const {
  getUserInfo,
  updateUser,
} = require('../controllers/users');

router.get('/me', getUserInfo);
router.patch('/me', updateUser);

module.exports = router;
