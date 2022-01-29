const { config } = require('dotenv');

config();

module.exports = {
  // App
  REFRESH_RATE_MIN: process.env.REFRESH_RATE_MIN || 60,
  LOG: process.env.LOG || false,
  MAX_ALERTS_ADDR_TRANSACT: process.env.MAX_ALERTS_ADDR_TRANSACT || 1,
  EMAIL_FROM: process.env.EMAIL_FROM,
  // AWS Config
  AWS_ACCESS: process.env.AWS_ACCESS,
  AWS_SECRET: process.env.AWS_SECRET,
  // Mongo DB
  MONGODB_URI: process.env.MONGODB_URI,
  // BTC
  BTC_URL: process.env.BTC_URL,
  BTC_ADDRESSES: process.env.BTC_ADDRESSES,
  BTC_PHONES: process.env.BTC_PHONES,
  BTC_EMAILS: process.env.BTC_EMAILS,
};
