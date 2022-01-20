const { mongoConnect } = require('./mongo');
import LaunchPlatform from './service/launch.service';

const platform = new LaunchPlatform();

(async () => {
  await mongoConnect();
  platform.launch();
})();
