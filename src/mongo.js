import UtilsService from './service/utils.service';
const mongoose = require('mongoose');
const models = require('./model/schema-index');
const { MONGODB_URI } = require('./config');

const utilsService = new UtilsService();

const mongoConnect = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    utilsService.log({ summary: 'mongo connected', message: MONGODB_URI });
  } catch (error) {
    utilsService.log({ summary: 'mongo connected', level: 'error', message: error });
  }
};

module.exports = { mongoConnect, models };
