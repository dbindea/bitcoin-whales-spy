const { mongoConnect } = require('./mongo');
import { REFRESH_RATE_MIN } from './config';
import LaunchPlatform from './service/launch.service';

const MIN = 1000 * 60;
const platform = new LaunchPlatform();

(async () => {
  await mongoConnect();
  setTimeout(() => {
    platform.launchBtc();
  }, MIN * REFRESH_RATE_MIN);
})();
