const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const uploadController = require('../controllers/uploadController');

router.use(auth);

router.post('/image', upload.single('image'), uploadController.uploadImage);
router.post('/images', upload.array('images', 5), uploadController.uploadImages);
router.delete('/image/:publicId', uploadController.deleteImage);

module.exports = router;
