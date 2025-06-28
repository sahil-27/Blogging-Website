const express = require('express');
const UserController = require('../controllers/user');

const router = express.Router();

router.post('/signup', UserController.CreateUser);

router.post('/login', UserController.LoginUser);

router.post('/logs', UserController.PostLogs);

module.exports = router;

// this is the user route file