const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const productRoutes = require('./routes/productRoutes');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

const uploadsDir = path.join(__dirname, 'uploads');

// Check if the uploads folder exists, if not create it
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });  // Create the uploads folder if it doesn't exist
    console.log('Uploads folder created');
}

app.use('/uploads', express.static(uploadsDir));
app.use(helmet());
app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/product-uploads', uploadRoutes);
app.use('/products', productRoutes); // Use product routes

// Global error handler (optional)
app.use((err, req, res, next) => {
    console.log(err);
    
    res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
