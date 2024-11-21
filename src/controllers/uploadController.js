const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');  
const db = require('../config/db');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, '../uploads');  
        cb(null, uploadsDir);  
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  
    }
});

const upload = multer({ storage: storage });

// Function to handle CSV parsing and insert into database
const uploadCSV = async (req, res) => {
    const filePath = req.file.path;

    const products = []; 

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            const product = {
                campaign_name: row['Campaign Name'],
                ad_group_id: row['Ad Group ID'],
                fsn_id: row['FSN ID'],
                product_name: row['Product Name'],
                ad_spend: parseFloat(row['Ad Spend']),
                views: parseInt(row['Views']),
                clicks: parseInt(row['Clicks']),
                direct_revenue: parseFloat(row['Direct Revenue']),
                indirect_revenue: parseFloat(row['Indirect Revenue']),
                direct_units: parseInt(row['Direct Units']),
                indirect_units: parseInt(row['Indirect Units'])
            };
            products.push(product);
        })
        .on('end', () => {
            const insertPromises = products.map((product) => {
                const query = `
                    INSERT INTO products (campaign_name, ad_group_id, fsn_id, product_name, 
                        ad_spend, views, clicks, direct_revenue, indirect_revenue, 
                        direct_units, indirect_units) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                return new Promise((resolve, reject) => {
                    db.run(query, [
                        product.campaign_name, product.ad_group_id, product.fsn_id, product.product_name,
                        product.ad_spend, product.views, product.clicks, product.direct_revenue,
                        product.indirect_revenue, product.direct_units, product.indirect_units
                    ], function(err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(this);
                        }
                    });
                });
            });

            Promise.all(insertPromises)
                .then(() => {
                    res.status(200).json({ message: 'CSV data uploaded and inserted into the database' });
                    fs.unlinkSync(filePath); 
                })
                .catch((err) => {
                    console.error(err);
                    res.status(500).json({ message: 'Error inserting data into the database' });
                });
        });
};

module.exports = {
    upload,
    uploadCSV
};
