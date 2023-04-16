import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products',
      required: true
    },
    // quantity: {
    //   type: Number,
    //   default: 1,
    //   min: 1
    // }
  }]
});

module.exports = mongoose.model('Carts', cartSchema);
