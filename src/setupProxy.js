const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/foobar2000',
    createProxyMiddleware({
      target: 'http://localhost:8880',
      changeOrigin: true,
    })
  );
};
