module.exports = {
  hmrPort: (parseInt(process.env.PORT, 10) + 1 || 3001),
  hmrHost: (process.env.HOST || '127.0.0.1'),
  appHost: '0.0.0.0',
  port: { development: 3000, production: 8080},
  assetsPrefix: '/rstatic',
  webpackPrefix: '/rstatic/dist/',
  appPrefix: '/rapp'
};
