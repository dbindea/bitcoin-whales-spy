import { BtcTransaction } from '../model/schema-index';
import UtilsService from './utils.service';

export default class MongoService {
  utilsService = new UtilsService();

  // BTC
  async saveBtcTransactions(btcTransactions) {
    const transactInput = [];
    btcTransactions.forEach((addressTransactions) => {
      const address = addressTransactions.address;
      const transactions = addressTransactions.transactions;
      transactions.forEach((transact) => {
        if (transact.amount > 2 || transact.amount < -2) {
          transactInput.push(
            new BtcTransaction({
              address,
              block: transact.block,
              amount: Math.floor(transact.amount),
              price: transact.price,
              currency: 'USD',
              time: transact.time,
            }),
          );
        }
      });
    });
    await BtcTransaction.insertMany(transactInput, { ordered: false }, (error, docs) => {
      if (error) this.utilsService.log({ summary: 'insert many error', level: 'error', message: {code: error.code} });
      else this.utilsService.log({ summary: 'insert many transactions', message: Object.keys(docs) });
    });
  }

  async getUnnotifiedBtcTransactions() {
    const filter = {
      is_checked: false,
    };
    const result = await BtcTransaction.find(filter);
    this.utilsService.log({ summary: 'search unnotified transactions', message: `transactions find count: ${result.length}` });

    const criteria = (a, b) => {
      return b.time.getTime() - a.time.getTime();
    };
    return result.sort(criteria);
  }

  async markAsChecked(transact) {
    await BtcTransaction.findOneAndUpdate({ _id: transact._id }, transact);
    this.utilsService.log({ summary: 'transtaction mark as checked', message: { _id: transact._id, block: transact.block, address: transact.address } });
  }

  // DASH
}
