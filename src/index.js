const { mongoConnect } = require('./mongo');
import { REFRESH_RATE_MIN } from './config';
import LaunchPlatform from './service/launch.service';

const MIN = 1000 * 60;
const platform = new LaunchPlatform();

(async () => {
  await mongoConnect();

  setInterval(() => {
    // BTC
    platform.launchBtc().then((result) => {
      if (result) {
        console.log('Last BTC process executed correctly at', new Date());
      }
    });
  }, MIN * REFRESH_RATE_MIN);
})();
