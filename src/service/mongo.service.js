import { BtcTransaction } from '../model/schema-index';

export default class MongoService {
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
    await BtcTransaction.insertMany(transactInput, { ordered: false }, (error, docs) => {});
  }

  async getUnnotifiedBtcTransactions() {
    const filter = {
      is_checked: false,
    };
    const result = await BtcTransaction.find(filter);
    const criteria = (a, b) => {
      return b.time.getTime() - a.time.getTime();
    };
    return result.sort(criteria);
  }

  async markAsChecked(transact) {
    await BtcTransaction.findOneAndUpdate({ _id: transact._id }, transact);
  }

  // DASH
}
