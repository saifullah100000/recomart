const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const { chatbotValidators } = require('../utils/validators');
const chatbotController = require('../controllers/chatbotController');

router.post('/message', chatbotValidators.message, validate, chatbotController.sendMessage);

module.exports = router;
