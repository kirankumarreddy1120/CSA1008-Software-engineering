const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory, clearChatHistory } = require('../controllers/chatController');

router.post('/', sendMessage);
router.get('/history', getChatHistory);
router.post('/clear', clearChatHistory);

module.exports = router;
