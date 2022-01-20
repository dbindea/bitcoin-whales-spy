import * as mongoose from 'mongoose';

export const btc_operations = mongoose.model(
  'btc_operations',
  new mongoose.Schema(
    {
      hash: { type: String },
      amount: { type: Number },
    },
    {
      timestamps: true,
    },
  ),
);
