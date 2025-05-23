const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { upload, uploadToS3 } = require('../utils/multer');

const { addImage, getAllImages, updateImage, deleteImage,deletesingle } = require('../controllers/galleryController');

// router.post('/', auth, upload.single('image'), addImage); //upload.single for single files
 router.post('/', auth, upload.array('images', 10), addImage); // accept up to 10 files

router.get('/', auth, getAllImages);
router.patch('/:id', auth, upload.array('images', 10), updateImage);
router.delete('/:id', auth, deleteImage);
// DELETE a single image from a gallery item
router.delete('/:id/image',auth,deletesingle )


module.exports = router;

