const { processConversationalQuery } = require('../services/aiService');
const { query } = require('../config/db');

exports.sendMessage = async (req, res, next) => {
  try {
    const { message, language = 'en', location = 'New Delhi', sessionId = 'default_user' } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Chat query cannot be empty.'
      });
    }

    // Process using AI Conversational Layer
    const aiResult = await processConversationalQuery({
      message,
      language,
      defaultLocation: location
    });

    // Log conversation turns into database
    try {
      await query(
        'INSERT INTO chat_history (session_id, role, message, intent, language, location_name, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [sessionId, 'user', message, aiResult.intent, language, location, null]
      );

      await query(
        'INSERT INTO chat_history (session_id, role, message, intent, language, location_name, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [sessionId, 'assistant', aiResult.response, aiResult.intent, language, aiResult.location, JSON.stringify(aiResult.keyMetrics || {})]
      );
    } catch (dbErr) {
      // Non-blocking log persistence
    }

    return res.status(200).json({
      success: true,
      data: {
        intent: aiResult.intent,
        location: aiResult.location,
        language: aiResult.language,
        response: aiResult.response,
        keyMetrics: aiResult.keyMetrics,
        weatherSnapshot: aiResult.weatherSnapshot,
        suggestedQueries: aiResult.suggestedQueries,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getChatHistory = async (req, res, next) => {
  try {
    const { sessionId = 'default_user' } = req.query;

    const rows = await query(
      'SELECT id, role, message, intent, language, location_name, metadata, created_at FROM chat_history WHERE session_id = ? ORDER BY created_at ASC',
      [sessionId]
    );

    return res.status(200).json({
      success: true,
      history: rows || []
    });
  } catch (error) {
    next(error);
  }
};

exports.clearChatHistory = async (req, res, next) => {
  try {
    const { sessionId = 'default_user' } = req.body;

    await query('DELETE FROM chat_history WHERE session_id = ?', [sessionId]);

    return res.status(200).json({
      success: true,
      message: 'Chat conversation history cleared successfully.'
    });
  } catch (error) {
    next(error);
  }
};
