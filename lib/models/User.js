import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ['FARMER', 'CUSTOMER', 'ADMIN', 'DELIVERY_PARTNER'], default: 'CUSTOMER' },
  phone:     { type: String, default: null },
  location:  { type: String, default: null },
}, { timestamps: true });

// Virtual 'id' that maps _id → string
UserSchema.set('toJSON', {
  virtuals: true,
  transform(_, ret) { delete ret.__v; }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
