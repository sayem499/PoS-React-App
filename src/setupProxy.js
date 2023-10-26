const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: /* 'http://host.docker.internal:5000' ||  */'http://localhost:5000',
      changeOrigin: true,
    })
  );
};