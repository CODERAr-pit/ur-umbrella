const { Redis } = require('@upstash/redis');

// Create the client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Export using CommonJS
module.exports = redis;