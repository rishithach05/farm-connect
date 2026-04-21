import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity:  { type: Number, required: true },
  price:     { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema({
  customerId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  total:        { type: Number, required: true },
  status:       { type: String, default: 'Placed' }, // Placed, Accepted, Packed, Out for Delivery, Delivered
  deliveryType: { type: String, default: 'self' },   // self, partner
  deliveryFee:  { type: Number, default: 0 },
  agentName:    { type: String, default: null },
  agentPhone:   { type: String, default: null },
  agentVehicle: { type: String, default: null },
  eta:          { type: Number, default: null },      // minutes
  items:        [OrderItemSchema],
}, { timestamps: true });

OrderSchema.set('toJSON', {
  virtuals: true,
  transform(_, ret) { delete ret.__v; }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
