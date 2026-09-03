// Centralized Error Handling Middleware for WeatherGPT
function errorHandler(err, req, res, next) {
  console.error(`❌ [WeatherGPT Server Error] ${req.method} ${req.url}:`, err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error occurred in WeatherGPT Engine.';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      type: err.name || 'ServerError',
      timestamp: new Date().toISOString()
    }
  });
}

module.exports = errorHandler;
