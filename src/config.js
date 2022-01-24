const { config } = require('dotenv');

config();

module.exports = {
  // App
  REFRESH_RATE_MIN: process.env.REFRESH_RATE_MIN,
  // Mongo DB
  MONGODB_URI: process.env.MONGODB_URI,
  // BTC
  BTC_URL: process.env.BTC_URL,
  BTC_ADDRESSES: process.env.BTC_ADDRESSES,
  BTC_PHONES: process.env.BTC_PHONES,
  BTC_MAILS: process.env.BTC_MAILS
}
