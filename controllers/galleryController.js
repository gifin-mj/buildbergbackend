const { S3 } = require('@aws-sdk/client-s3');
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

 try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ message: 'Gallery not found' });

    // Update basic fields
    const { name, date, status, sizeSqFt, clientDetails } = req.body;
    if (name) gallery.name = name;
    if (date) gallery.date = date;
    if (status) gallery.status = status;
    if (sizeSqFt) gallery.sizeSqFt = sizeSqFt;
    if (clientDetails) gallery.clientDetails = clientDetails;

    // If new images uploaded
    if (req.files && req.files.length > 0) {
      // Delete old images from S3
      // for (const oldUrl of gallery.images) {
      //   const key = extractS3KeyFromUrl(oldUrl);
      //   await deleteFromS3(key);
      // }

      // Upload new images
      const s3UploadUrls = [];
      for (const file of req.files) {
        const result = await uploadToS3(file);
        //s3UploadUrls.push(result);
        gallery.images.push(result)
      }

      //gallery.images = s3UploadUrls;
    }

    await gallery.save();
    res.json({ message: 'Gallery updated successfully', gallery });
  } catch (err) {
    console.error('❌ Update error:', err);
    res.status(500).json({ message: 'Server error during update' });
  }

    // const updated = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    // res.json(updated);
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

exports.deletesingle= async (req, res) => {
  const { id } = req.params;
  const { imageUrl } = req.body;

  if (!imageUrl) return res.status(400).json({ error: 'Image URL required' });

  try {
    // 1. Delete image from S3
    const key = decodeURIComponent(new URL(imageUrl).pathname).substring(1); // remove leading '/'
    // await S3.send(new DeleteObjectCommand({
    //   Bucket: process.env.S3_BUCKET_NAME,
    //   Key: key,
    // }));
     await deleteFromS3(key);
    // 2. Pull image URL from DB
    await Gallery.findByIdAndUpdate(id, {
      $pull: { images: imageUrl }
    });

    res.json({ message: 'Image deleted' });
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ error: 'Failed to delete image' });
  }
}



