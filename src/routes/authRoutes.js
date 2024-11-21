const express = require('express');
const {validate} = require('../middlewares/validateMiddleware');
const { registerUser, loginUser } = require('../controllers/authController');
const { loginUserValidation, registerUserValidation } = require('../validation/authValidation');

const router = express.Router();

// Register new user
router.post('/register', validate(registerUserValidation),registerUser);

// Get all users
router.post('/login',validate(loginUserValidation),loginUser);

module.exports = router;
