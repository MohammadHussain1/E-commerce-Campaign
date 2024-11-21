const db = require('../config/db');

// Utility function to wrap SQLite queries in promises
const runQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
};

const getQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const getAllDataQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};
const insertUser = async (username, password, email) => {
    const query = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
    const result = await runQuery(query, [username, password, email]);
    return result.lastID;  // Return the inserted user ID
};

const getUserByUserEmail = async (email) => {
    const query = `SELECT * FROM users WHERE email = ?`;
    const user = await getQuery(query, [email]);
    return user;
};

const getUserByUsernameOrEmail = async (username, email) => {
    const query = `SELECT * FROM users WHERE username = ? OR email = ?`;
    const user = await getQuery(query, [username, email]);
    return user;
};

const getAllUsers = async () => {
    const query = `SELECT * FROM users`;
    const users = await getAllDataQuery(query);    
    return users;
};

const getUserById = async (id) => {
    const query = `SELECT * FROM users WHERE id = ?`;
    const user = await getQuery(query, [id]);
    return user;
};

const updateUser = async (id, username, password, email) => {
    const query = `UPDATE users SET username = ?, password = ?, email = ? WHERE id = ?`;
    const result = await runQuery(query, [username, password, email, id]);
    return result.changes;  // Return number of updated rows
};

const deleteUser = async (id) => {
    const query = `DELETE FROM users WHERE id = ?`;
    const result = await runQuery(query, [id]);
    return result.changes;  // Return number of deleted rows
};

module.exports = {
    insertUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserByUsernameOrEmail,
    getUserByUserEmail
};
