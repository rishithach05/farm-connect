import mongoose from 'mongoose';

const WishlistSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
}, { timestamps: true });

// Enforce unique (userId, productId) pairs — same as Prisma @@unique
WishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

WishlistSchema.set('toJSON', {
  virtuals: true,
  transform(_, ret) { delete ret.__v; }
});

export default mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema);
