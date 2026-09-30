const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const dns = require('dns');
const path = require('path');
const connectDB = require('./config/db');

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));   // ← YO ADD GARNUS

app.get('/', (req, res) => {
  res.json({ message: '🚀 Nepali Mart API chalirako cha!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});