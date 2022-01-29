import Log from '../model/log.model';
import config from '../config';
const moment = require('moment');

export default class UtilsService {
  splitData(string) {
    return string
      .split(',')
      .filter((el) => el != null && el.toString().trim())
      .map((el) => el.trim());
  }

  log(log) {
    const _log = new Log({
      summary: log.summary || '',
      level: log.level || 'info',
      message: typeof log.message === 'object' && log.message !== null ? JSON.stringify(log.message) : log.message,
      timestamp: moment().format('DD MMM YYYY, HH:mm:ss'),
    });
    if (config.LOG) {
      console.log({ ..._log });
    }
  }
}
