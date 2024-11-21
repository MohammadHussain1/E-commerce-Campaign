const jwt = require('jsonwebtoken');
const { getUserById } = require('../models/userModel');
require('dotenv').config()

const authMiddleware = async(req, res, next) => {
    let token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    token=token.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await getUserById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
