const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_ORIGIN_URL/* 'http://host.docker.internal:5000' ||  *//* 'http://localhost:5000' */ /* 'https://pos-app-backend.onrender.com' */,
      changeOrigin: true,
    })
  );
};