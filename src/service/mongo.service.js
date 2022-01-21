import { BtcTransaction } from '../model/schema-index';

export default class MongoService {
  // BTC
  async saveBtcTransactions(btcTransactions) {
    const transactInput = [];
    btcTransactions.forEach((addressTransactions) => {
      const address = addressTransactions.address;
      const transactions = addressTransactions.transactions;
      transactions.forEach((transaction) => {
        if (transaction.amount > 2 || transaction.amount < -2) {
          transactInput.push(
            new BtcTransaction({
              address,
              block: transaction.block,
              amount: Math.floor(transaction.amount),
              price: transaction.price,
              currency: transaction.currency,
              time: transaction.time,
            }),
          );
        }
      });
    });
    await BtcTransaction.insertMany(transactInput, { ordered: false });
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

  async updateBtcTransactions(transactions) {}

  // DASH
}
