const { mongoConnect } = require('./mongo');
import config, { REFRESH_RATE_MIN } from './config';
import LaunchPlatform from './service/launch.service';

const MIN = 1000 * 60;
const platform = new LaunchPlatform();

(async () => {
  
  console.log(config);

  await mongoConnect();

  // First launch
  await platform.launchBtc();
  console.log('First BTC process executed correctly at', new Date());

  setInterval(() => {
    // BTC
    platform.launchBtc().then((result) => {
      if (result) {
        console.log('Last BTC process executed correctly at', new Date());
      }
    });
  }, MIN * REFRESH_RATE_MIN);
})();
