// api/serverless.js
// Serverless function handler untuk Vercel

// Import Express app dari hasil compile TypeScript
const app = require('../dist/index').default;

// Export untuk Vercel serverless function
module.exports = app;