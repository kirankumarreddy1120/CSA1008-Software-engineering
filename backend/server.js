const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDB, isMySQLConnected } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend clients
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-Id']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check / System Diagnostics endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    system: 'WeatherGPT – Conversational AI for Weather Forecasting, Alerts & Climate',
    organization: 'Ministry of Earth Sciences (MoES) / India Meteorological Department (IMD)',
    theme: 'Disaster Management & Climate Resilience',
    version: '1.0.0',
    mysqlConnected: isMySQLConnected(),
    timestamp: new Date().toISOString()
  });
});

// Register Domain Specific Routes
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/saved-locations', require('./routes/savedLocationRoutes'));

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `WeatherGPT API endpoint '${req.originalUrl}' does not exist.`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Initialize DB and Launch HTTP Server
async function startServer() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`======================================================================`);
    console.log(`🌦️  WeatherGPT API Server is active on port: ${PORT}`);
    console.log(`📡 Health Check URL : http://localhost:${PORT}/api/health`);
    console.log(`💬 AI Chat Endpoint : http://localhost:${PORT}/api/chat`);
    console.log(`🌍 Weather Endpoint : http://localhost:${PORT}/api/weather/current`);
    console.log(`======================================================================`);
  });
}

startServer();

module.exports = app;
