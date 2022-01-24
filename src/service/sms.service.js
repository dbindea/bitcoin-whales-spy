import MongoService from './mongo.service';

export default class SmsService {
  mongo = new MongoService();
  async notifySmsSubscribers(phoneArray, unnotifiedTransactions) {
    unnotifiedTransactions.forEach((transact) => {
      if (!transact.is_checked) {
        if (transact.amount > 0) {
          let text = '';
          if (transact.amount > 0) {
            text = `🐳 Buys ${transact.amount} ${transact.asset}`;
          } else {
            text = `🐳 Sells ${transact.amount} ${transact.asset}`;
          }
        }
        phoneArray.forEach((phone) => {
          this.sendSms(phone, text);
        });
      }
    });
  }

  async sendSms(phone, text) {
    // TODO: to develop
    return null;
  }
}
