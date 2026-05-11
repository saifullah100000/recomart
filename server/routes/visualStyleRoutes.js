const express = require('express');

const multer = require('multer');

const router = express.Router();

const {
  visualRoomRecommendation
} = require(
  '../controllers/visualStyleController'
);

const storage =
  multer.diskStorage({

    destination:
      function (
        req,
        file,
        cb
      ) {

        cb(
          null,
          'uploads/'
        );
      },

    filename:
      function (
        req,
        file,
        cb
      ) {

        cb(
          null,

          Date.now() +
            '-' +
            file.originalname
        );
      }
  });

const upload =
  multer({
    storage
  });

router.post(

  '/room',

  upload.single('image'),

  visualRoomRecommendation
);

module.exports = router;