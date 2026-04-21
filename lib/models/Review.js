import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  rating:    { type: Number, required: true, min: 1, max: 5 },
  comment:   { type: String, default: null },
}, { timestamps: true });

ReviewSchema.set('toJSON', {
  virtuals: true,
  transform(_, ret) { delete ret.__v; }
});

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
