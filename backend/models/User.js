import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  phone:        { type: String, default: '' },
  passwordHash: { type: String, required: true },
  farm: {
    state: { type: String, default: 'Punjab' },
    area:  { type: Number, default: 12 },
    crops: { type: [String], default: ['Wheat', 'Cotton'] },
  },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
