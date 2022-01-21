const { Schema, model } = require('mongoose');

const BtcSchema = new Schema(
  {
    address: { type: String },
    block: { type: String },
    amount: { type: Number },
    asset: { type: String, default: 'BTC' },
    price: { type: Number },
    currency: { type: String },
    time: { type: Date },
    is_checked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

BtcSchema.index({ address: 1, block: 1 }, { unique: true });
module.exports = model('Btc_Transactions', BtcSchema);
