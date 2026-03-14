const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const invoiceRoutes = require('./routes/invoiceRoutes');
const goldRateRoutes = require('./routes/goldRateRoutes');

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/invoices', invoiceRoutes);
app.use('/api/goldrate', goldRateRoutes);

// Simple status route
app.get('/', (req, res) => {
    res.send('Prayosha Invoice API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
