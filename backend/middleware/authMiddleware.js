const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_placetrack_key_2026_academic_assignment';

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is missing. Please log in.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const [rows] = await query('SELECT id, name, email, role, avatar_url FROM users WHERE id = ?', [decoded.id]);
    if (!rows || rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session or user no longer exists.'
      });
    }

    const user = rows[0];

    // If student, attach student profile record
    if (user.role === 'student') {
      const [studentRows] = await query('SELECT * FROM students WHERE user_id = ?', [user.id]);
      if (studentRows && studentRows.length > 0) {
        user.student = studentRows[0];
      }
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired or invalid token. Please log in again.'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Authentication verification error: ' + error.message
    });
  }
}

module.exports = authMiddleware;
