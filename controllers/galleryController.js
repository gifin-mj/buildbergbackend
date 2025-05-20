const Gallery = require('../models/Gallery');

exports.addImage = async (req, res) => {
    const { name, date, status, sizeSqFt, clientDetails } = req.body;
    const imageUrl = req.file.location;

    const newImage = new Gallery({ name, date, status, sizeSqFt, clientDetails, imageUrl });
    await newImage.save();
    res.status(201).json(newImage);
};

exports.getAllImages = async (req, res) => {
    const images = await Gallery.find().sort({ date: -1 });
    res.json(images);
};

exports.updateImage = async (req, res) => {
    const updated = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
};

exports.deleteImage = async (req, res) => {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted successfully' });
};



// exports.addImage = async (req, res) => {
//     const { name, date, status, sizeSqFt, clientDetails } = req.body;
//     const images = req.files.map(file => file.location); // multiple image URLs
  
//     const newProject = new Gallery({ name, date, status, sizeSqFt, clientDetails, images });
//     await newProject.save();
//     res.status(201).json(newProject);
//   };
  