import config from '../config';
import BitcoinService from './btc.service';
import MailService from './mail.service';
import MongoService from './mongo.service';
import SmsService from './sms.service';
import UtilsService from './utils.service';

export default class LaunchPlatform {
  btcService = new BitcoinService();
  mongoService = new MongoService();
  smsService = new SmsService();
  mailService = new MailService();
  utilsService = new UtilsService();

  async launchBtc() {
    // const btcTransactions = await this.btcService.scanBtc();
    // await this.mongoService.saveBtcTransactions(btcTransactions);
    const phoneArray = this.utilsService.splitData(config.BTC_PHONES);
    const mailArray = this.utilsService.splitData(config.BTC_MAILS);
    const unnotifiedTransactions = await this.mongoService.getUnnotifiedBtcTransactions();
    // await this.smsService.notifySmsSubscribers(phoneArray, unnotifiedTransactions);
    await this.mailService.notifyMailSubscribers(mailArray, unnotifiedTransactions);
    return true;
  }
}
