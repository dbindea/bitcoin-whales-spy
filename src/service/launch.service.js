import config from '../config';
import BitcoinService from './btc.service';
import EmailService from './email.service';
import MongoService from './mongo.service';
import SmsService from './sms.service';
import UtilsService from './utils.service';

export default class LaunchPlatform {
  btcService = new BitcoinService();
  mongoService = new MongoService();
  smsService = new SmsService();
  emailService = new EmailService();
  utilsService = new UtilsService();

  async launchBtc() {
    const btcTransactions = await this.btcService.scanBtc();
    await this.mongoService.saveBtcTransactions(btcTransactions);
    const phoneArray = this.utilsService.splitData(config.BTC_PHONES);
    const emailArray = this.utilsService.splitData(config.BTC_EMAILS);
    // const unnotifiedTransactions = await this.mongoService.getUnnotifiedBtcTransactions();
    // await this.smsService.notifySmsSubscribers(phoneArray, unnotifiedTransactions);
    // await this.emailService.notifyEmailSubscribers(emailArray, unnotifiedTransactions);
    return true;
  }
}
