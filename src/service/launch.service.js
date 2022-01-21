import config from '../config';
import BitcoinService from './btc.service';
import MongoService from './mongo.service';
import SmsService from './sms.service';
import UtilsService from './utils.service';

export default class LaunchPlatform {
  btcService = new BitcoinService();
  mongoService = new MongoService();
  smsService = new SmsService();
  utilsService = new UtilsService();

  async launchBtc() {
    //const btcTransactions = await this.btcService.scanBtc();
    //await this.mongoService.saveBtcTransactions(btcTransactions);
    const phoneArray = this.utilsService.splitData(config.BTC_PHONES);
    const unnotifiedTransactions = await this.mongoService.getUnnotifiedBtcTransactions();

    const notifiedTransactions = await this.smsService.notifySmsSubscribers(phoneArray, unnotifiedTransactions);

    // await this.mongoService.updateBtcTransactions(notifiedTransactions);
  }
}
