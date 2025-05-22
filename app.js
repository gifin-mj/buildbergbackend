const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
var logger = require('morgan');
const authRoutes = require('./routes/auth');
const galleryRoutes = require('./routes/gallery');
 
const app = express();
app.use(cors());
app.use(express.json());
app.use(logger('dev'));
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/gallery', galleryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
