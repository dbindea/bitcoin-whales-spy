import MongoService from './mongo.service';

export default class SmsService {
  mongo = new MongoService();
  async notifySmsSubscribers(phoneArray, unnotifiedTransactions) {
    unnotifiedTransactions.forEach((transact) => {
      if (!transact.is_checked) {
        if (transact.amount > 0) {
          console.info(
            `[...${transact.address.substr(transact.address.length - 5)}] Compra ${transact.amount} ${transact.asset} a ${transact.price} ${
              transact.currency
            } a las ${transact.time.getHours()}:${transact.time.getMinutes()}`,
          );
        } else {
          console.info(
            `[...${transact.address.substr(transact.address.length - 5)}] Venta ${transact.amount} ${transact.asset} a ${transact.price} ${
              transact.currency
            } a las ${transact.time.getHours()}:${transact.time.getMinutes()}`,
          );
        }
        transact.is_checked = true;
        this.mongo.markAsChecked(transact);
      }
    });
  }

  async sendSms(phone, text) {
    let status = false;

    return status;
  }
}
