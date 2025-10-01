// Temporary debug route - add this to your auth routes
router.get('/debug', (req, res) => {
  res.json({
    success: true,
    debug: {
      cookies: req.cookies,
      headers: {
        origin: req.headers.origin,
        'user-agent': req.headers['user-agent'],
        authorization: req.headers.authorization
      },
      session: req.sessionId || 'No session',
      environment: process.env.NODE_ENV,
      corsOrigins: process.env.CORS_ORIGINS
    }
  });
});