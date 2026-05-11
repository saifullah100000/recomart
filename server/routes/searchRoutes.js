const express = require('express');

const multer = require('multer');

const path = require('path');

const router = express.Router();

const {
  search,
  imageSearch,
  getSuggestions
} = require('../controllers/searchController');

// DISK STORAGE
const storage = multer.diskStorage({

  destination: (
    req,
    file,
    cb
  ) => {

    cb(null, 'uploads/');
  },

  filename: (
    req,
    file,
    cb
  ) => {

    cb(
      null,
      Date.now() +
      path.extname(file.originalname)
    );
  }
});

const upload = multer({
  storage
});

// TEXT SEARCH
router.get('/', search);

// IMAGE SEARCH
router.post(
  '/image',
  upload.single('image'),
  imageSearch
);

// SEARCH SUGGESTIONS
router.get(
  '/suggestions',
  getSuggestions
);

module.exports = router;