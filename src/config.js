const { config } = require('dotenv');

config();

module.exports = {
  MONGODB_URI: process.env.MONGODB_URI,
  BTC_URL: process.env.BTC_URL,
  BTC_ADDRESSES: process.env.BTC_ADDRESSES,
};
