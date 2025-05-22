


const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  name: String,
  images: [String], // now stores multiple image URLs
  date: Date,
  status: String,
  sizeSqFt: Number,
  clientDetails: String
});

module.exports = mongoose.model('Gallery', gallerySchema);
