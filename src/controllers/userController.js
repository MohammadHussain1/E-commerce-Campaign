const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const { insertUser,getAllUsers, getUserById, updateUser, deleteUser, getUserByUserEmail } = require('../models/userModel');

// Register a new user
const createUser = async (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        const existingUser = await getUserByUserEmail(email);   
              
        if (existingUser) {
            return res.status(400).json({ message: 'User details already exist' });
        }
        await insertUser(username, hashedPassword, email);
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating user' });
    }
};

const getAllUsersDetails = async (req, res) => {
    try {
        const users = await getAllUsers();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving users' });
    }
};


// Get user details by ID
const getUserByIdDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving user' });
    }
};

// Update user details
const updateUserDetails = async (req, res) => {
    const { id } = req.params;
    const { username, password, email } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        const existingUser = await getUserByUserEmail(username, email);         
        if (existingUser && existingUser.id !== id) {
            return res.status(400).json({ message: 'user is not exists' });
        }

        const changes = await updateUser(id, username, hashedPassword, email);
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating user' });
    }
};

// Delete a user
const deleteUserById = async (req, res) => {
    const { id } = req.params;

    try {

        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await deleteUser(id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting user' });
    }
};

module.exports = {
    createUser,
    getAllUsersDetails,
    getUserByIdDetails,
    updateUserDetails,
    deleteUserById
};
