const Gallery = require('../models/Gallery');
const { uploadToS3,uploadMultipleToS3 } = require('../utils/multer');
const { deleteFromS3 } = require('../utils/s3');

function extractS3KeyFromUrl(url) {
  const urlObj = new URL(url);
  return decodeURIComponent(urlObj.pathname.slice(1)); // remove leading "/"
}

exports.addImage = async (req, res) => {
 
  try{
  const uploaded = await uploadMultipleToS3(req.files);

   
   const { name, date, status, sizeSqFt, clientDetails } = req.body;
     const images =  uploaded.map(({ url, key }) => (
        url
      ))
   
  
    const newProject = new Gallery({ name, date, status, sizeSqFt, clientDetails, images });
    await newProject.save();
    res.status(201).json(newProject);
    
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ message: 'Failed to upload images' });
  }
   
    
   
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

  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ message: 'Not found' });

    // Delete all images from S3
    if (gallery.images && gallery.images.length > 0) {
      for (const url of gallery.images) {
        const key = extractS3KeyFromUrl(url);
        await deleteFromS3(key);
      }
    }

    // Delete DB entry
    await gallery.deleteOne();

    res.json({ message: 'Gallery and images deleted successfully' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }


    // await Gallery.findByIdAndDelete(req.params.id);
    // res.json({ msg: 'Deleted successfully' });
};



