const mongoose = require('mongoose');
const models = require('./model/schema-index');
const { MONGODB_URI } = require('./config');

const mongoConnect = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Mongo connected');
  } catch (error) {
    console.error(error);
  }
};

module.exports = { mongoConnect, models };
