const { getUserByUserEmail, getUserByUsernameOrEmail, insertUser } = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken } = require("../utils/generateTokenUtils");

// Register a new user
const registerUser = async (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {

        const existingUser = await getUserByUsernameOrEmail(username, email);         
        if (existingUser) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }
        await insertUser(username, hashedPassword, email);
        res.status(201).json({ message: 'User register successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error user register' });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await getUserByUserEmail(email);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const token = generateToken(user.id);
        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error logging in user' });
    }
};

module.exports = {
    registerUser,
    loginUser, 
};
