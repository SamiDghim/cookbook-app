const { app } = require('./app');
const http = require('http');

const port = process.env.PORT || 4000;
const server = http.createServer(app);

server.listen(port, () => console.log(`API server listening on port ${port}`));

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => process.exit(0));
});
