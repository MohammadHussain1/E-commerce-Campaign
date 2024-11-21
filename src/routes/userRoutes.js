const express = require('express');
const { createUser, getAllUsersDetails,getUserByIdDetails, updateUserDetails, deleteUserById } = require('../controllers/userController');
const {validate} = require('../middlewares/validateMiddleware');
const { updateUserValidation, deleteUserByIdValidation, getUserByIdValidation, createUserValidation } = require('../validation/userValidation');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Register new user
router.post('/',authMiddleware, validate(createUserValidation),createUser);

// Get all users
router.get('/',authMiddleware,getAllUsersDetails);

// Get user by ID
router.get('/:id',authMiddleware,validate(getUserByIdValidation),getUserByIdDetails);

// Update user details
router.put('/:id',authMiddleware,validate(updateUserValidation),updateUserDetails);

// Delete user
router.delete('/:id',authMiddleware,validate(deleteUserByIdValidation),deleteUserById);

module.exports = router;
