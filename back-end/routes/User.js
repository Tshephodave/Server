const express = require('express');
const { register, login, logout, getUser} = require('../controller/userController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/:userId', getUser);
router.post('/logout',  logout);

module.exports = router;
