const { mongoConnect } = require('./mongo');
import { REFRESH_RATE_MIN } from './config';
import LaunchPlatform from './service/launch.service';
import UtilsService from './service/utils.service';

const MIN = 1000 * 60;
const platform = new LaunchPlatform();
const utils = new UtilsService();

(async () => {
  await mongoConnect();

  // First launch
  await platform.launchBtc();
  utils.log({ summary: 'launchBtc', message: 'First BTC process executed correctly' });

  setInterval(() => {
    // BTC
    platform.launchBtc().then(() => {
      utils.log({ summary: 'launchBtc', message: 'Last BTC process executed correctly' });
    });
  }, MIN * REFRESH_RATE_MIN);
})();
