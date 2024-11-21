const sqlite3 = require('sqlite3').verbose();

// Create a new SQLite database or open an existing one
const db = new sqlite3.Database('./db.sqlite', (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to the SQLite database');
    }
});

// Create the users table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
    )`);
});

// Create products table
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            campaign_name TEXT,
            ad_group_id TEXT,
            fsn_id TEXT,
            product_name TEXT,
            ad_spend REAL,
            views INTEGER,
            clicks INTEGER,
            direct_revenue REAL,
            indirect_revenue REAL,
            direct_units INTEGER,
            indirect_units INTEGER
        )
    `);
});


module.exports = db;
