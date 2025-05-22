const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { upload, uploadToS3 } = require('../utils/multer');

const { addImage, getAllImages, updateImage, deleteImage } = require('../controllers/galleryController');

// router.post('/', auth, upload.single('image'), addImage); //upload.single for single files
 router.post('/', auth, upload.array('images', 10), addImage); // accept up to 10 files

router.get('/', auth, getAllImages);
router.patch('/:id', auth, updateImage);
router.delete('/:id', auth, deleteImage);

module.exports = router;

