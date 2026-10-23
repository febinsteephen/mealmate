const errorHandler = (err, req, res, next) => {
  // Log internal error for developers
  console.error('[Error Details]:', err.stack || err.message);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred',
    // In production, do not leak stack traces
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
