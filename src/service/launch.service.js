import config from '../config';
import BitcoinService from './assets/btc.service';
import EmailService from './email.service';
import MongoService from './mongo.service';
import SmsService from './sms.service';
import UtilsService from './utils.service';

// const browser = require('./browser');

export default class LaunchPlatform {
  btcService = new BitcoinService();
  mongoService = new MongoService();
  smsService = new SmsService();
  emailService = new EmailService();
  utilsService = new UtilsService();

  async launchBtc() {
    // let browserInstance = await browser.startBrowser(browser);

    const btcTransactions = await this.btcService.scanBtcScrapIt();
    this.utilsService.log({ summary: 'scrap BTC addresses', message: btcTransactions.length });

    const docs = await this.mongoService.saveBtcTransactions(btcTransactions);
    this.utilsService.log({ summary: 'insert many transactions', message: `transactions count: ${docs.length}` });

    // const phoneArray = this.utilsService.splitData(config.BTC_PHONES);
    const emailArray = this.utilsService.splitData(config.BTC_EMAILS);
    const unnotifiedTransactions = await this.mongoService.getUnnotifiedBtcTransactions();
    this.utilsService.log({ summary: 'get unnotified transactions', message: `transactions count: ${unnotifiedTransactions.length}` });

    // await this.smsService.notifySmsSubscribers(phoneArray, unnotifiedTransactions);
    await this.emailService.notifyEmailSubscribers(emailArray, unnotifiedTransactions);

    // await browser.close();
  }
}
