import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  description:    { type: String, default: '' },
  price:          { type: Number, required: true },
  unit:           { type: String, default: 'kg' },
  quantity:       { type: Number, default: 0 },
  category:       { type: String, default: 'vegetables' },
  deliveryOption: { type: String, enum: ['SELF', 'AGENT', 'BOTH'], default: 'BOTH' },
  image:          { type: String, default: null },
  farmerId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

ProductSchema.set('toJSON', {
  virtuals: true,
  transform(_, ret) { delete ret.__v; }
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
